import craftai from 'craft-ai';
import DATASET_FILE from '../data/ROOM_R1.json';
import moment from 'moment';
import { Time } from 'craft-ai';

const DATASET_FILENAME = 'data/ROOM_R1.json';
const CRAFT_AGENT = 'YourAgentName';
const TIME_QUANTUM = 20 * 60; // 20 minutes in sec

let CRAFT_CLIENT = craftai({
  owner: process.env.CRAFT_OWNER,
  token: process.env.CRAFT_TOKEN,
  url: process.env.CRAFT_URL,
  operationsChunksSize: 200
});

const CRAFT_MODEL = {
  context: {
    movement: {
      type: 'enum'
    },
    light: {
      type: 'enum'
    },
    time: {
      type: 'time_of_day'
    },
    day: {
      type: 'day_of_week'
    },
    month: {
      type: 'continuous'
    },
    tz: {
      type: 'timezone'
    }
  },
  output: ['light'],
  time_quantum: TIME_QUANTUM
};

export function initialization() {
  return CRAFT_CLIENT.destroyAgent(CRAFT_AGENT)
    // 1 - Create the agent
    .then(() => {
      console.log(`Creating agent ${CRAFT_AGENT} from the following model.`, CRAFT_MODEL);
      return CRAFT_CLIENT.createAgent(CRAFT_MODEL, CRAFT_AGENT);
    })
    // 2 - Send the dataset's operations
    .then(() => {
      console.log(`Adding context operations to agent ${CRAFT_AGENT} from '${DATASET_FILENAME}'`);
      return CRAFT_CLIENT.addAgentContextOperations(CRAFT_AGENT, DATASET_FILE);
    })
    // 3 -  Retrieve the decision tree
    .then(() => {
      console.log(`Operations successfully added to agent ${CRAFT_AGENT}`);
      return CRAFT_CLIENT.getAgentDecisionTree(CRAFT_AGENT, 1272745200);
    })
    .then((tree) => {
      console.log('You can view your decision tree on https://beta.craft.ai');
      return tree;
    })
    .catch(error => console.log('Error!', error));
}

export function decide(movement, dateTime, tree) {
  return new Promise((resolve, reject) => {
    // Take decision from the decision tree
    let decision = craftai.decide(
      tree,
      {
        movement: movement,
        month: moment(dateTime).month()
      },
      new Time(dateTime)
    );

    return resolve({
      lightState: decision.decision.light,
      confidence: decision.confidence
    });
  });
}
