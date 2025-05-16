import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProviderTs } from './create-user.provider.ts';

describe('CreateUserProviderTs', () => {
  let provider: CreateUserProviderTs;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserProviderTs],
    }).compile();

    provider = module.get<CreateUserProviderTs>(CreateUserProviderTs);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
