
CREATE TABLE IF NOT EXISTS users (
  user_id	              VARCHAR(36) PRIMARY KEY,
  identity_number       BIGINT NOT NULL UNIQUE,
  access_token          VARCHAR(512) NOT NULL DEFAULT '',
  full_name             VARCHAR(512) NOT NULL,
  avatar_url            VARCHAR(1024) NOT NULL,
  created_at            VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS webhooks (
  webhook_id           VARCHAR(36) NOT NULL PRIMARY KEY,
  conversation_id      VARCHAR(36) NOT NULL,
  user_id              VARCHAR(36) NOT NULL,
  name                 VARCHAR(512) NOT NULL,
  signature            VARCHAR(512),
  created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);