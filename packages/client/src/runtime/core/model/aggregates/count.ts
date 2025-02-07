import type { Client } from '../../../getPrismaClient'
import type { ModelAction } from '../applyModel'
import { aggregate } from './aggregate'

/**
 * Executes the `.count` action on a model via {@link aggregate}.
 * @param client to provide dmmf information
 * @param userArgs the user input to desugar
 * @param modelAction a callback action that triggers request execution
 * @returns
 */
export function count(client: Client, userArgs: object | undefined, modelAction: ModelAction) {
  // count is an aggregate, we reuse them but hijack their unpacker

  if (typeof userArgs?.['select'] === 'object') {
    return aggregate(client, { _count: userArgs['select'] }, (p) =>
      modelAction({ ...p, unpacker: (data) => p.unpacker?.(data)['_count'] }),
    ) // for count selects, return the relevant part of the result
  } else {
    return aggregate(client, { _count: { _all: true } }, (p) =>
      modelAction({ ...p, unpacker: (data) => p.unpacker?.(data)['_count']['_all'] }),
    ) // for simple counts, just return the result that is a number
  }
}
