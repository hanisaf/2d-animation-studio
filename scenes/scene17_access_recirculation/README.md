# Dr. Sami Explains Access Recirculation

168 seconds · 1920 × 1080 · 24 fps · Dr. Sami in the lecture hall.

## Synopsis

Dr. Sami follows blood through a normal dialysis circuit, then reveals the local venous-to-arterial shortcut. Animated particles distinguish fresh, solute-rich blood from already-cleared blood. He connects the shortcut to low delivered Kt/V, separates AV access and catheter causes, distinguishes cardiopulmonary recirculation, and demonstrates the revised urea slow–stop sampling method.

## Script and shot list

| Time | Board / action | Dr. Sami |
|---|---|---|
| 0–14 s | Good flow. Poor clearance? | The pump looks fine. So why is the *dialysis dose low*? Access recirculation can send *cleared blood* straight back. |
| 14–28 s | First: the normal route | Fresh blood enters the *arterial line*, then the dialyzer. The *venous line* returns cleared blood to the circulation. |
| 28–42 s | The short circuit | Now some venous blood loops back to the *arterial pickup*. It skips systemic mixing and gets *dialyzed again*. |
| 42–56 s | Fresh inflow cannot keep up | In an AV access, *Qb greater than access flow* drives the loop. Less fresh blood reaches the filter. *Less solute is removed*. |
| 56–70 s | Why an AV access recirculates | A *downstream stenosis* can reduce fistula or graft flow. Needles too close, or poorly positioned, can also contribute. |
| 70–84 s | Why a catheter recirculates | Think *tip proximity, malposition, or a fibrin sheath*. Reversed arterial and venous lines can create a shortcut too. |
| 84–98 s | Local loop versus heart–lung loop | Local access recirculation is the *unwanted short circuit*. AV accesses also have a small *cardiopulmonary* component. |
| 98–112 s | Measure the right phenomenon | *Ultrasound dilution* directly evaluates access recirculation. Urea sampling is an alternative. Machine methods vary. |
| 112–126 s | A and V: sample at full flow | At the usual Qb, draw *A and V simultaneously*. A is the arterial-line BUN. V is the venous-line BUN. |
| 126–140 s | S: the revised slow–stop method | Reduce Qb to *120 mL/min* and wait *10 seconds*. Then stop the pump and draw *S from the arterial line*. |
| 140–154 s | Turn three BUN values into a percentage | Use *S minus A*, divided by *S minus V*, times 100. If S is 60, A is 54, and V is 20, then *R is 15%*. |
| 154–168 s | Interpret carefully. Investigate the access. | For slow–stop urea: *>10%* strongly suggests recirculation. Repeated *>5%* values matter. Confirm technique and the cause. |

## Clinical detail and source notes

Access recirculation returns recently dialyzed blood to the arterial inflow before systemic mixing. This reduces the solute concentration reaching the dialyzer and effective clearance, despite apparently adequate displayed pump flow. Low Kt/V and persistent hyperkalemia or azotemia are clues, not diagnostic proof.

For AV fistulas/grafts, access flow below pump withdrawal is a central mechanism; downstream stenosis and needle placement should be considered. For catheters, local geometry, tip position, fibrin sheath, and line reversal may matter even when central venous flow is high. Avoid treating low whole-access flow as the only catheter mechanism.

Cardiopulmonary recirculation is the heart–lung return of dialyzed blood before complete tissue mixing, associated with AV access. The approximately 5–7% thermodilution baseline in the supplied notes is method-dependent and is not a universal abnormality threshold.

Ultrasound/saline dilution is a reference approach. Automated thermal and ionic-dialysance measurements require method-specific interpretation; they should not all be treated as direct local-recirculation measurements. The alternative taught here is the revised slow–stop urea method: simultaneous arterial (A) and venous (V) line samples at normal Qb; reduce Qb to 120 mL/min for 10 seconds, stop the pump, and obtain systemic (S) BUN from the arterial line according to the validated sampling protocol. This is not the separate routine postdialysis BUN sampling protocol.

R (%) = (S − A) / (S − V) × 100. All three BUN values use the same units. The fictional worked example S=60, A=54, V=20 mg/dL gives 15%. If S=V, the denominator is zero and the result is undefined. Unexpected values require sampling/assay review. Single >10% and repeated >5% values refer to the revised slow–stop urea validation, not every monitor.

Do not substitute an opposite-arm peripheral venous sample: arterial–peripheral urea disequilibrium can produce false apparent recirculation. Tattersall et al. reported approximately 12.5% by the older method despite no recirculation by saline dilution. Sampling and pump manipulation belong to trained dialysis staff using the unit protocol.

## References

1. Tan J et al. Identifying Hemodialysis Catheter Recirculation Using Effective Ionic Dialysance. ASAIO J. 2012;58:522–525. [PubMed](https://pubmed.ncbi.nlm.nih.gov/22929893/) · [DOI](https://doi.org/10.1097/MAT.0b013e318263210b).
2. Smyth B, Hawley CM, Jardine M. Dialysis Dose and Adequacy for Hemodialysis. Evidence-Based Nephrology, 2nd edition, 2022. Source supplied by the user.
3. Depner TA, Krivitski NM, MacGibbon D. Hemodialysis Access Recirculation Measured by Ultrasound Dilution. ASAIO J. 1995;41:M749–M753. [DOI](https://doi.org/10.1097/00002480-199507000-00113).
4. Tattersall JE et al. Haemodialysis Recirculation Detected by the Three-Sample Method Is an Artefact. NDT. 1993;8:60–63. [PubMed](https://pubmed.ncbi.nlm.nih.gov/8381938/) · [DOI](https://doi.org/10.1093/oxfordjournals.ndt.a092274).
5. Kapoian T, Steward CA, Sherman RA. Validation of a Revised Slow-Stop Flow Recirculation Method. Kidney Int. 1997;52:839–842. [PubMed](https://pubmed.ncbi.nlm.nih.gov/9291207/) · [DOI](https://doi.org/10.1038/ki.1997.402).
6. KDOQI Clinical Practice Guideline for Hemodialysis Adequacy: 2015 Update. AJKD. 2015;66:884–930. [DOI](https://doi.org/10.1053/j.ajkd.2015.07.015).

## Playback and export

Open `studio.html?scene=scene17_access_recirculation` in the running studio. The scene uses existing synthesized cartoon vocalizations, with the actual words in speech bubbles; it is not a recorded spoken narration. Standard scene MP4 and standalone JavaScript exports work through the studio. All motion is a deterministic function of scene time, with private IIFE helpers.

## Validation

JavaScript syntax, scene/movie registration, and all 24 nonoverlapping dialogue windows pass. Thirty-eight representative and boundary frames execute through the real drawing engine, Dr. Sami rig, and lecture hall with a mock canvas; no nonfinite drawing arguments or runtime errors were detected. Visual rendering was attempted with the project renderer and a pipe-transport fallback, but Chrome startup timed out. Layout, playback audio, and MP4 export have not been visually verified.
