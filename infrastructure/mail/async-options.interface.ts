import { ModuleMetadata, Provider } from '@nestjs/common';
import { NodeMailerOptions } from './options.interface';

export interface NodeMailerAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (
    ...args: any[]
  ) => Promise<NodeMailerOptions> | NodeMailerOptions;
  extraProviders?: Provider[];
}
