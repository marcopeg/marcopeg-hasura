function hasuraClaimsRule(user, context, callback) {
  const namespace = "https://hasura.io/jwt/claims";
  const auth0Id = user.user_id;

  const query = `
		query getUserId ($auth0Id:String!) {
			users(where: { auth0_id: { _eq: $auth0Id }}) { id }
    }
  `;

  const variables = { auth0Id };

  const handleResponse = (error, response, body) => {
    if (error) {
      callback(error);
      return;
    }

    try {
      context.accessToken[namespace] = {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": JSON.parse(body).data.users[0].id.toString(),
        "x-auth0-user-id": user.user_id,
      };

      callback(null, user, context);
    } catch (err) {
      callback(err);
    }
  };

  request.post({
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": configuration.ACCESS_KEY
      },
      url: `${configuration.BASE_URL}/v1/graphql`,
      body: JSON.stringify({ query, variables })
    }, handleResponse);
}
