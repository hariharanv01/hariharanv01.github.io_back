---
title: OAuth 2.0 debunked
description: Understand the most popular authorization flow standard - OAuth 2.0 explained
layout: post
type: post
tags: [OAuth 2, authorization code, client credentials, implicit, resource owner password, access token]
categories: [agnostic, security]
---

Password based authentication is arguably the most common way of authentication right now. If a User wants to authenticate himself/herself to a Service provider he/she submits his user id and password to the service provider - usually through a secure channel(TLS/SSL) - in an HTML form (Form based authentication). If a Client Server wants to authenticate itself to a Service provider it submits its credentials (id and password) as a Authorization header (Basic authentication). This model of authenticating and authorizing works fine as long as only two parties are involved(in the first case the user and the Service provider, and in the second case the client server and the Service provider). However, this approach fails to do well when three parties are involved. Let's look at a scenario where three parties are involved.

Let's assume we have a user(James). James is a long time user of GMail. He has his contacts list(email ids) managed properly in GMail. James - being a old timer - do not have a Facebook account yet. But, desperately wants to create a new account as all his friends are using it. So, James signs up into Facebook. Facebook is useless until you have added your friends. Adding friends for the first time is pretty tedious since facebook do not have any information about James or his friends yet. So, it cannot suggest friends for James. So, James has to search all his friends one by one using their email id from his GMail contact list. What if facebook eases his effort by providing a means for automatically getting his contact list and suggesting him friends based on the email id/name in the contact list. Facebook provides a form in its page in which James can type his GMail user name and password. Once James entered his GMail credentials in the form and submits, Facebook logs into James' GMail account and get his contact list(lets say by screen scrapping) and automatically suggest James his friends. James is happy or is he?

Do you see any problem with his approach - James sharing his GMail credentials with Facebook? There are plenty. Let's jot down one by one.

1. First and foremost, James gives Facebook full access to his GMail account by sharing his GMail credentials with Facebook. Even though his intention is that Facebook will get just his contact list, the reality could be different. With his GMail credentials, Facebook can access anything and everything that James have access to in GMail. For eg, Facebook can read his mails, his GMail settings, his profile information and much more. In gist - there is absolutely no Access control. There is no well defined scope or permission(what to access and what not to access) for Facebook while accessing James' GMail account.

2. James thought that Facebook will access his GMail account only once to get his contact list. But, that may not be the case. Facebook can store his GMail credentials and use it later as well. Again, there is no well defined access control.

3. In case if Facebook stores his GMail credentials and in case if Facebook is hacked. There is a very good chance that James' GMail account is also compromised since Facebook has his GMail credentials. The only way he can save his GMail account is by immediately changing his GMail password.

4. If the above happens and James had already shared his GMail credentials with Twitter for a multiple time usage pattern(eg. for showing him tweets that are more relevant to his emails), his Twitter account will not work properly since his GMail credentials that Twitter has is no longer valid. He has to reset his GMail account in Twitter as well. If he had already shared his GMail credentials with multiple services, he might need to reset his GMail credentials everywhere.

To overcome all these problems is why OAuth came into picture. We will now discuss how OAuth works. We will concentrate only on OAuth2 since it's the latest version and is also more flexible than OAuth 1 albeit requiring more security emphasis.

OAuth2 is a token based authorization standard that emphasizes on access control and usage limitation. In OAuth2, there is usually three parties involved - a Resource owner, a Client and a Service Provider. Lets first understand what each means.

1. Resource - the entity that needs to be accessed. In our case, it's James' GMail contact list.

2. Resource owner - the one who owns the resource. James is our resource owner.

3. Service provider - the one who hosts and provides the resource. In our case GMail is the Service Provider.

4. Client - the one who wants to access the resource on behalf of the resource owner. Facebook in our case.


OAuth2 starts with the Client registering itself with the Service provider. It's a one time affair after which the Client is issued a Client id and usually a Client secret. It's the Client's responsibility to confidentially maintain the secret if it's issued one.  Once the client registration is done, the OAuth2 flow can begin. 

Facebook registers itself as a client with GMail, and is issued aa client id and secret. James logs into Facebook. He's seeing a new link in Facebook saying "Import your GMail contacts". On clicking it he is redirected to GMail's login page. James is happy now - he knows that he's entering his GMail credentials in GMail login page and not sharing it with Facebook. The login page also shows what all information Facebook will be able to access in James' GMail account. 

![Auth Consent page]({{site.url}}/static/img/OAuth_authorization_interface.png)

As you can see the consent page shows clearly who is the Client and what is it trying to access. James now knows that Facebook will be able to access only his contact list and not read his email or other GMail stuff. Once he's consented, he is redirected to a Facebook page which suggests him the list of friends he can add.

Let's now see the background magic.

To start with GMail has a list of well defined scopes(permissions) that clients can ask for. For example, Scope.ReadMail, Scope.SendMail, Scope.ReadContacts, etc.


> Note that all the GMail scopes and APIs mentioned are for reference purpose only. They do not match with the actual GMail APIs or scopes.


Once James clicks on "Import GMail Contacts" from Facebook, Facebook redirects him to the GMail's authorize page.

```js

https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=<facebook-client-id>&redirect_uri=http://facebook.com/gmailcallback&scope=Scope.ReadContacts

```

| Propery | Description|
|:----|:----|
| response_type | code - to get the authorization code(auth code). think of code like a one time code for now. |
| redirect_uri  | where to redirect the user with the auth code once the authentication is over.             |
| client_id     | Client id | 

<br>

James now sees the consent page. Once consented, he's redirected to the redirect_uri with the auth code.

```js

http://facebook.com/gmailcallback?code=1223321

```

Facebook uses the auth code along with its client id and secret and retrieves the Access token from GMail's token API. Access token is the token that will be used to access the resource.

```sh

Request: 

https://accounts.google.com/o/oauth2/v2/token?client_id=<facebook-client-id>&redirect_uri=http://facebook.com/gmailcallback&code=1223321&grant_type=authorization_code

Header:
Authorization: Basic someEncodedForm(facebook client id and secret)


Response:
{
  "access_token":"hhGS323SFA3112DGDSGDSsah",
  "token_type":"Bearer",
  "expires_in":3600
}

```

we'll discuss more about grant_type query parameter and the response fields later.

With the access token, Facebook can now access GMail contacts API.

```sh

https://www.googleapis.com/gmail/v1/users/james@gmail.com/contacts

Header:
Authorization: Bearer <access_token>

Response:
<Contacts JSON payload>

```

Once Facebook has retrieved James' contact list, it can parse it and suggest friends to James.

Now let's see how OAuth2 flow overcomes the problem we had with password sharing approach.

1. Each access token has well defined scopes/permission. Token issued to Facebook can only access James' contact list. The permission is also clearly mentioned to James in the consent page.

2. Facebook can decide to store the access token. But each access token expires after certain duration(```expires_in``` in the response payload of Token API call denotes how long the access token is valid. In our case, it's 3600 seconds or 1 hour).

3. Even if Facebook is hacked, and if the hacker managed to get James' access token. The hacker can access James' contact list alone; also the token must have been issued within an hour else it would have expired and cannot be used.

4. Tokens given to multiple clients are mutually exclusive. Even if facebook is hacked, token issued to twitter and other clients will continue to work properly without any disruption or need to invalidate anything.


Awesome. So, we have overcome the problems we had with the password sharing approach. Now, lets dive into OAuth2 a bit deeper.

OAuth2 has more than one way for retrieving the access token. The flow we discussed so far is called Authorization code grant type. Grant type is an OAuth2 terminology that denotes the flow to retrieve access token. Before talking about the different grant types, let's first gist various terminologies in OAuth2

|----+----|
| Property | Description |
|:----:|:----|
| Authorization code / auth code / code | A one time code that's used to retrieve the access token. |
|----+----|
| Access token | The token that's used to access the resource |
|----+----|
| Refresh token | Since Access tokens have short life span, they are usually accompanied with Refresh token that have much longer expiry duration. New access tokens can be retrieved using refresh tokens. Service Providers can decide on which Clients or grant types or scopes or the combination of these three must be given refresh tokens. |
|----+----|
| response_type | A parameter used while retrieving access token to indicate whether to get the auth code or access token |
|----+----|
| state | some info agnostic to service provider that the client uses while making OAuth2 requests to maintain some state in its side |
|----+----|

<br>

> Usually Authentication and Authorization are done by an Authorization server other than the service provider which the Service provider recognizes, but for simplicity purpose we can assume that the Service Provider also handles authentication and authorization.


----------------------------------------------------------------

### Authorization code Grant

We have already discussed the Authorization code grant in the Facebook-GMail scenario. The intermediary auth code is used here for multiple reasons. Foremost is to ensure that the token is never exposed to anyone else other than the Client itself - this won't be the case if the Service provider redirects the user with the token instead of the code. Also, Client secret cannot be sent to the user-agent by any means.

![Auth code grant]({{site.url}}/static/img/auth_code.jpg)


### Implicit Grant

Sometimes, the Client will be a dumb client - not a server and like mobile apps, browser JS client, etc. In this case, the clients are usually not capable of confidentially maintaining their client credentials and also cannot host a redirection endpoint that the Service provider can redirect the resource owner to. These clients are called public clients since they cannot confidentially maintain their client credentials and are hence issued only Client id without client secret. Also, since these clients are not servers they cannot host a redirection endpoint and hence cannot use authorization code grant(as the service provider will need to redirect the resource owner to the client redirection uri with the auth code in authorization code grant).

These clients, hence, will need to use implicit grant type. In this grant type, Clients are issued directly the Access token after resource owner consent.

![Implicit grant]({{site.url}}/static/img/implicit.jpg)


### Client credentials Grant

In this grant type, Clients themselves are the resource owner as well. Clients are issued tokens solely on the basis of Client credentials with any user consent. eg. Facebook has a GMail corporate account, and wants to access it. This grant can also be used to give trusted clients access to resources. For eg. Google Ads service wants to read all GMail users' emails to show them more relevant ads. GMail can issue Google Ads a token with which Google Ads can read user emails but not change his email settings or send mail on his behalf.

![Client creds grant]({{site.url}}/static/img/client_creds.jpg)


### Resource owner password Grant

If the resource owner trusts the Client, he can share his Service Provider credentials with the Client. In this grant, Client goes to Service Provider with the resource owner's credentials and gets the access token. The difference between the password sharing approach we discussed earlier and this one is that there is well define scopes here.

![Resource owner grant]({{site.url}}/static/img/ro_creds.jpg)


### Refresh token Grant

This grant is applicable for confidential clients that are eligible for refresh tokens. For these clients Refresh tokens are issued along with Access tokens in the Token API call. Since Access tokens are usually short lived, to get a new Access token the entire flow needs to be replayed. With Refresh token - however - it's not needed. The client can go with the refresh token and get a new access token.

Refresh token needs to be maintained confidentially.


### Misc info on OAuth2
Having discussed all the grant types, there are certains things we need to ensure before implementing or using OAuth2 service. A few are

1. Almost all of the OAuth2 endpoints and redirection uri need to over SSL/TLS since sensitive information like access token, refresh token, client credentials, resource owner credentials, etc are transmitted over wire. Else, it's susceptible to man-in-the-middle attacks.

2. The token issuer must validate redirect_uri against client id to ensure that there is no uri manipulation attack. A hacker can construct a valid authorize request with the hacker's redirect_uri if redirect_uri is not validated.

3. OAuth code should be used only once and only by the client it's issued to. The Token issuer needs to validate this.

4. If clients are maintaining user sessions, they need to ensure that they are not vulnerable to CSRF attacks.

There are lot more emphasis on security while using OAuth2. Since, it's a large topic we can skip it for now.


Hope you guys got a good understanding of the beautiful standard called OAuth2. It's one of the widely used Authorization standard out there. If you are using Google or Facebook or Twitter or most of the Open REST APIs, you are using OAuth for authorization.

