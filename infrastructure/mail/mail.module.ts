import { DynamicModule, Module } from '@nestjs/common';
import { NodeMailerOptions } from './options.interface';
import { NodeMailerService } from './mail.service';
import { MAIL_OPTIONS_TOKEN } from './mail.constants';
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
}
