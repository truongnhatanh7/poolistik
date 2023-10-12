import { DynamicModule, Module, Provider } from '@nestjs/common';
import { NodeMailerOptions } from './options.interface';
import { NodeMailerService } from './mail.service';
import { MAIL_OPTIONS_TOKEN } from './mail.constants';
import { NodeMailerAsyncOptions } from './async-options.interface';
// TODO: refactor
@Module({
  providers: [NodeMailerService],
  exports: [NodeMailerService, MAIL_OPTIONS_TOKEN],
})
export class NodeMailerModule {
  static register(nodeMailerOptions: NodeMailerOptions): DynamicModule {
    return {
      module: NodeMailerModule,
      providers: [
        {
          provide: MAIL_OPTIONS_TOKEN,
          useValue: nodeMailerOptions,
        },
        NodeMailerService,
      ],
      exports: [NodeMailerService],
    };
  }

  static registerAsync(
    nodeMailerOptions: NodeMailerAsyncOptions,
  ): DynamicModule {
    const provider = [this.createAsyncProvider(nodeMailerOptions)];
    return {
      module: NodeMailerModule,
      providers: [...provider, NodeMailerService],
      imports: nodeMailerOptions.imports,
      exports: [NodeMailerService],
    };
  }

  private static createAsyncProvider(
    nodeMailerOptions: NodeMailerAsyncOptions,
  ): Provider {
    if (nodeMailerOptions.useFactory) {
      return {
        provide: MAIL_OPTIONS_TOKEN,
        useFactory: nodeMailerOptions.useFactory,
        inject: nodeMailerOptions.inject,
      };
    }
  }
}
