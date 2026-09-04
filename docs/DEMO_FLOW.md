# SANJEEVANI — Hackathon Demonstration Workflow

This document outlines the step-by-step end-to-end demonstration flow for judges and evaluators.

## 22-Step Verification Walkthrough

1. **Launch Application:** Open Sanjeevani on mobile device/emulator. Splash screen displays "SANJEEVANI — Connected Public Healthcare" with prototype banner.
2. **Language Selection:** Switch language between English, मराठी (Marathi), and हिंदी (Hindi). UI updates instantly.
3. **Role Switcher / Quick Auth:** Select **Healthcare Worker** role. Use quick demo login button or enter OTP `123456`.
4. **Worker Dashboard:** Dashboard shows "Good Morning, Sunita — ASHA Worker, Shivapur PHC". View today's visit count and pending tasks.
5. **Open Patient Record:** Search for patient **Ramesh Patil** or select from assigned community list.
6. **Record Vitals & Symptoms:** Enter vitals: Temperature 38.5°C, Heart Rate 98 bpm, BP 130/85, SpO2 92% (Low), Symptoms: Persistent fever (5 days) + breathing difficulty.
7. **Execute Digital Triage:** Tap **Run Digital Triage**.
8. **Triage Recommendation Result:**
   - Suggested Priority: **HIGH** (Confidence 87%)
   - Explanation Factors: "Low oxygen saturation (92%)", "Persistent fever (5 days)"
   - Safety Status: Healthcare Professional Review Required.
9. **Switch Role to Doctor:** Tap quick role-switcher to log in as **Dr. Ananya Deshmukh (Mulshi Rural Hospital)**.
10. **Doctor Priority Queue:** View patient Ramesh Patil flagged at top of queue with HIGH priority badge and SHAP factors.
11. **Doctor Triage Review:** Review suggestion. Select **ACCEPT PRIORITY** (or test **OVERRIDE** with custom clinical reason).
12. **Assisted Teleconsultation Shell:** Doctor initiates assisted teleconsultation with ASHA Sunita More and patient Ramesh Patil.
13. **Clinical Encounter Record:** Doctor documents diagnosis, records clinical note ("Acute respiratory infection, evaluate at Rural Hospital").
14. **Create Closed-Loop Referral:** Doctor initiates Referral from **Shivapur PHC** to **Mulshi Rural Hospital**. Set priority HIGH.
15. **Patient Referral Timeline View:** Switch role to **Patient (Ramesh Patil)**. Open **My Care Journey** → **Referrals**. View live vertical timeline with progress indicator.
16. **Receiving Facility Accepts Referral:** Log back as Doctor / Receiving Facility Admin at Mulshi RH. Tap **Accept Referral**.
17. **Appointment Scheduling:** System schedules referral appointment token for Ramesh Patil.
18. **Encounter Outcome & Return Care Plan:** Doctor completes consultation, attaches return care plan for local community follow-up.
19. **Simulate Network Outage (Offline Mode):** Disconnect network (or toggle Offline Switcher in dev header). App banner changes to "Offline Mode".
20. **Offline Worker Follow-Up:** Log back as ASHA Sunita More. Open assigned follow-up for Ramesh Patil. Record outreach notes and vitals while offline. Queue counter shows "1 update waiting to sync".
21. **Restore Network & Synchronize:** Re-enable network. Tap **Sync Now** or allow auto-sync. Progress bar completes: "1 of 1 synchronized". Queue clears.
22. **Admin Verification:** Log in as **Administrator**. Verify updated referral metrics, follow-up completion status, and audit logs.
