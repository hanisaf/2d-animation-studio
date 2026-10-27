import assert from 'node:assert/strict';

// Exercise browser-delivered touch pointers, rather than synthetic pointer events.
export async function checkGameTouch(page, game) {
  const soccer = game === 'world-champion';
  const url = page.url();
  for (const viewport of [
    { width: 320, height: 568 }, { width: 390, height: 844 },
    { width: 667, height: 375 }, { width: 844, height: 390 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewport({ ...viewport, isMobile: true, hasTouch: true });
    await page.goto(url);
    await page.tap(soccer ? '[data-hero="sami"]' : '[data-hero="neptune"]');
    await page.tap(soccer ? '#start' : '#confirm-hero');
    await page.evaluate(() => scrollTo(0, 0));
    const geometry = await page.evaluate(() => {
      const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height, bottom:r.bottom, right:r.right }; };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        targets: [...document.querySelectorAll('.touch button, #pause, #restart')].map(rect),
        field: rect(document.querySelector('canvas')), width: innerWidth, height: innerHeight,
      };
    });
    assert(!geometry.overflow, `${game} horizontal overflow at ${viewport.width}`);
    for (const r of geometry.targets) {
      assert(r.width >= 44 && r.height >= 44, `${game} undersized touch target at ${viewport.width}: ${JSON.stringify(r)}`);
      // Tablets can scroll; phone play layouts keep the field and controls in view together.
      if (viewport.width < 900) assert(r.x >= 0 && r.y >= 0 && r.right <= geometry.width && r.bottom <= geometry.height,
        `${game} control outside phone viewport ${viewport.width}: ${JSON.stringify(r)}`);
    }
    if (viewport.width < 900) assert(geometry.field.y >= 0 && geometry.field.bottom <= geometry.height, `${game} field fits`);
    await page.$eval('.touch', el=>el.scrollIntoView({block:'nearest'}));
    const session = await page.createCDPSession();
    const point = async (control, id) => page.$eval(`[data-control="${control}"]`, (el, id) => {
      const r=el.getBoundingClientRect(); return { x:r.x+r.width/2, y:r.y+r.height/2, id };
    }, id);
    const direction = soccer ? 'up-right' : 'right';
    const action = soccer ? 'shoot' : 'fire';
    const moving = await point(direction, 1), firing = await point(action, 2);
    const scrollBefore = await page.evaluate(() => scrollY);
    await session.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[moving, firing] });
    assert.equal(await page.$$eval('.touch .active', els=>els.length), 2, `${game} multitouch at ${viewport.width}`);
    if (soccer) {
      const left = await point('up-left', 1);
      await session.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[left, firing] });
      assert(await page.$eval('[data-control="up-left"]', el=>el.classList.contains('active')), 'slide changes steering');
      assert(!(await page.$eval('[data-control="up-right"]', el=>el.classList.contains('active'))));
    }
    await session.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[soccer ? await point('up-left', 1) : moving] });
    assert.equal(await page.$$eval('.touch .active', els=>els.length), 1, 'releasing steering keeps firing');
    assert(await page.$eval(`[data-control="${action}"]`, el=>el.classList.contains('active')));
    await session.send('Input.dispatchTouchEvent', { type:'touchCancel', touchPoints:[] });
    assert.equal(await page.$$eval('.touch .active', els=>els.length), 0);
    assert.equal(await page.evaluate(() => scrollY), scrollBefore, 'held controls do not scroll');
    // Pause while a pointer is held: resuming must require fresh input.
    await session.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[firing] });
    await page.$eval('#pause', el=>el.click());
    assert.equal(await page.$$eval('.touch .active', els=>els.length), 0);
    await session.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
    await page.tap('#start');
    assert(await page.$eval('#overlay', el=>el.hidden));
    await page.tap('#restart');
    assert.equal(await page.$$eval('.touch .active', els=>els.length), 0);
    await page.$eval('.touch', el=>el.scrollIntoView({block:'nearest'}));
    // A touch capture lost unexpectedly must release its input.
    await page.evaluate(() => {
      document.querySelector('[data-control="right"]').addEventListener('pointerdown', e=>{window.testPointerId=e.pointerId;}, {once:true});
    });
    const held = await point('right', 3);
    await session.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[held] });
    held.x += 2;
    await session.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[held] });
    await page.evaluate(()=>{
      const button=document.querySelector('[data-control="right"]');
      button.releasePointerCapture(window.testPointerId);
    });
    held.x += 2;
    await session.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[held] });
    await page.waitForFunction(()=>!document.querySelector('.touch .active'));
    await session.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
    await page.screenshot({ path:`/tmp/${game}-touch-${viewport.width}.png`, fullPage:true });
    await session.detach();
  }
}
