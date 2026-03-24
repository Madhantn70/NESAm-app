# Swagger API Testing Guide: Register & Login Flow

This guide walks through testing the **Registration** and **One-Time Token (OTT) Login** flow via Swagger UI. Based on the deep dive into the codebase, the backend leverages Spring Security 6+ OTT Login, but there are a few architectural quirks you need to account for.

## Phase 1: Registration (`POST /api/v1/users/register`)

1. **Open Swagger UI**: Navigate your browser to [http://localhost:9090/swagger-ui/index.html](http://localhost:9090/swagger-ui/index.html).
2. **Locate Endpoint**: Under `profile-controller`, find `POST /api/v1/users/register`.
3. **Execute**: Click **"Try it out"** and input the following JSON body (modify `irttaaId` as needed):
    ```json
    {
      "mobileNumber": "9876543210",
      "fullName": "Test User",
      "email": "test@example.com",
      "irttaaId": "12345"
    }
    ```
4. **Verify**: You should receive a `201 Created` with your User Profile object from the database.

---

## Phase 2: Generating the One-Time Token (The Missing Link)

### Why isn't OTT Generate in Swagger?
The token generation API is a **built-in Spring Security Filter**, not a mapped `@RestController` method. Because it lacks typical SpringDoc annotations, Swagger UI does not detect it! 

### 🚨 Codebase Bug Alert (Action Required)
Currently, Spring Security OTT defaults to generating tokens at `POST /ott/generate`. However, your [WebSecurityConfig.java](file:///f:/NESAm%20app/nesam-api/nesam/src/main/java/org/irtt/nesam/configuration/WebSecurityConfig.java) attempts to disable CSRF on `/api/v1/users/ott/token` instead! Since the CSRF ignore doesn't match the default generate URL, testing via Postman or cURL currently returns a `403 Forbidden`.

To fix this and make it testable, update your [WebSecurityConfig.java](file:///f:/NESAm%20app/nesam-api/nesam/src/main/java/org/irtt/nesam/configuration/WebSecurityConfig.java) roughly around Line 72:

```java
.oneTimeTokenLogin((ott) -> ott
    .showDefaultSubmitPage(false)
    .generateTokenUrl("/api/v1/users/ott/token") // <-- ADD THIS LINE
)
```

### How to trigger the Token (After the fix):
Since Swagger doesn't display it, you will need to use PowerShell, Postman, or cURL to trigger a magic link.
```bash
curl -X POST http://localhost:9090/api/v1/users/ott/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=9876543210"
```

Because of your [ConsoleOTTHandler.java](file:///f:/NESAm%20app/nesam-api/nesam/src/main/java/org/irtt/nesam/services/ConsoleOTTHandler.java), this won't actually text the user. Instead, keep an eye on your backend terminal console! You will see an output like:
> `INFO --- Testing: token url http://localhost:9090/login/ott?token=ea11a3b1-....`

---

## Phase 3: Login (`POST /api/v1/users/ott/login`)

Once you've grabbed the generated `token` string from your terminal console in Phase 2, you can jump back into Swagger UI to get your final authentication token. 

1. **Reopen Swagger UI**.
2. **Locate Endpoint**: Under `profile-controller`, find `POST /api/v1/users/ott/login`.
3. **Execute**: Click **"Try it out"**.
4. **Input Data**: The API expects the raw token string inside the `@RequestBody String token`. Enter **just the token GUID** itself, without surrounding quotes or JSON braces (e.g. `ea11a3b1-abc1-1234...`).
5. **Verify**: You will receive an `200 OK` response returning the generated **JWT Token String**. This token represents your fully authenticated state.

### Using the JWT for Protected Routes
Currently your application sets all routes except `register` and `ott/*` as `.anyRequest().authenticated()`. To test protected routes in the future, you should click **"Authorize"** in Swagger UI and provide this JWT token as an HTTP Bearer Token.
