# Step-by-Step Backend Testing Guide (Swagger UI)

> **⚠️ CRITICAL FIRST STEP: Restart the Server!**
> The changes we just made are brand new. If your backend is already running (`bootRun`), you **MUST restart it**.
> 1. Go to the terminal running `.\gradlew bootRun`.
> 2. Press `Ctrl + C` to stop the server.
> 3. Run `.\gradlew bootRun` again.
> 4. Refresh your Swagger page at `http://localhost:9090/swagger-ui/index.html`. 
> 
> *Once refreshed, you will see `Public Registration` and `Authentication` tags.*

---

## Part 1: How to Test the Multi-Step Registration

This flow registers a new user and membership without needing to be logged in.

### Step 1: Verify Email
1. Scroll down to the **Public Registration** section.
2. Click on `POST /api/v1/public/registration/verify-email`.
3. Click the **"Try it out"** button.
4. In the `email` field, type a test email: `fresh_alumni@example.com`.
5. Click **"Execute"**.
6. *Scroll down to the Responses section. You should see a green 200 code confirming the email was verified.*

### Step 2: Verify OTP
1. Click on `POST /api/v1/public/registration/verify-otp`.
2. Click **"Try it out"**.
3. Fill in the `email`: `fresh_alumni@example.com`.
4. Fill in the `otp`: `1234`.
5. Click **"Execute"**.
6. *You should see a success message saying the OTP is verified.*

### Step 3: Submit Registration (Final Step)
1. Click on `POST /api/v1/public/registration/submit`.
2. Click **"Try it out"**.
3. In the main text box (Request body), erase everything and paste this exact JSON:

```json
{
  "email": "fresh_alumni@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "category": "LIFETIME",
  "graduationYear": 2018,
  "nominees": [
    {
      "name": "Jane Doe",
      "relationship": "SPOUSE",
      "percentage": 100.0,
      "dateOfBirth": "1992-08-20"
    }
  ],
  "selfDeclarationAccepted": true
}
```
4. Click **"Execute"**.
5. *Under Responses, you will see a 201 Created code with your new `nesamId`.*

---

## Part 2: How to Test the Login Flow (Authentication)

Now that you have registered a user (`fresh_alumni@example.com`), let's log them in.

### Step 1: Generate an OTP for Login
1. Scroll to the **Authentication** section.
2. Click on `POST /api/v1/users/ott/token`.
3. Click **"Try it out"**.
4. In the `email` box, type the email we just registered: `fresh_alumni@example.com`.
5. Click **"Execute"**. 
6. *It will return a 200 OK. Now, look at your Spring Boot Terminal / Command Prompt.* You will see a log line like this:
   `Testing Console Provider: OTP for fresh_alumni@example.com is [YOUR_6_DIGIT_OTP_HERE]`
7. Copy that 6-digit OTP number.

### Step 2: Login using the OTP
1. Still in the **Authentication** section, click on `POST /api/v1/users/ott/login`.
2. Click **"Try it out"**.
3. In the main text box, delete everything and paste **ONLY your 6-digit OTP** (no quotes, no brackets, just the number).
4. Click **"Execute"**.
5. *Under Responses, you will see a long, random-looking text string. This is your JWT Token! Copy the entire string without quotes.*

### Step 3: Authorize Swagger UI
1. Scroll to the very top of the Swagger page.
2. Click the green **Authorize** button with the lock icon.
3. A popup will appear. Paste the JWT token string you just copied into the `Value` box.
4. Click **Authorize**, then click **Close**.

*You are now fully logged in to Swagger! You can now scroll down to `user-controller` and securely execute `GET /api/v1/users/me` without getting an error.*
