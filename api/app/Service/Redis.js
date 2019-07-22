const Redis = use('Redis')

class RedisService
{
  async get(key)
  {
    return JSON.parse(await Redis.get(key))
  }

  async set(key, data)
  {
    await Redis.set(key, JSON.stringify(data))
  }
}

module.exports = RedisService
