const program = Effect.fail("hello")
  .fork()
  .withSpan("my-span", [{ key: "hello", value: "world" }])
  .flatMap((fiber) => fiber.join())

program.unsafeRunPromiseExit().then(console.log)
