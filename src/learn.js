import craftai from 'craft-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.load();

const DATASET_FILENAME = 'ROOM_R1.json';
const CRAFT_AGENT = 'YourAgentName';
const TIME_QUANTUM = 20 * 60; // 20 minutes in sec
const DATASET_DIR = path.join(__dirname, '../data');
const DATASET_FILE = require(path.join(DATASET_DIR, DATASET_FILENAME));

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

// 0 - Cleanup the mess
CRAFT_CLIENT.destroyAgent(CRAFT_AGENT)
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
.then(() => {
  return CRAFT_CLIENT.getAgent(CRAFT_AGENT)
  .then(() => {
    console.log(`Operations successfully added to agent ${CRAFT_AGENT}`);
  });
})
.then(() => {
  console.log('You can view your decision tree on https://beta.craft.ai')
})
.catch(error => console.log('Error!', error));
