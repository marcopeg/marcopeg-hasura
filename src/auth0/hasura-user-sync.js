function userSyncRule(user, context, callback) {
  const userId = user.user_id;
  const nickname = user.nickname;

  const mutation = `mutation($userId: String!, $nickname: String, $user: jsonb) {
    insert_users(objects: [{
        auth0_id: $userId,
        name: $nickname,
				data: $user,
      }],
      on_conflict: {
        constraint: users_pkey,
        update_columns: [last_seen, name, data]
      }) {
        affected_rows
      }
    }`;

  request.post(
    {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": configuration.ACCESS_KEY
      },
      url: `${configuration.BASE_URL}/v1/graphql`,
      body: JSON.stringify({ query: mutation, variables: { userId, nickname, user } })
    },
    function(error, response, body) {
      console.log(body);
      callback(error, user, context);
    }
  );
}
