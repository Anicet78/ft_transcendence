import { Type } from 'typebox';

export const ParamIdSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  })
};

export const SendRequestSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  })
};

export const UpdateRequestSchema = {
  params: Type.Object({
    id: Type.String({ format: 'uuid' })
  }),
  body: Type.Object({
    action: Type.Union([
      Type.Literal('accept'),
      Type.Literal('reject')
    ])
  })
};
