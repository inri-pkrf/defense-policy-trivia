import Scenario01 from './scenarios/Scenario01';
import Scenario02 from './scenarios/Scenario02';
import Scenario03 from './scenarios/Scenario03';
import Scenario04 from './scenarios/Scenario04';
import Scenario05 from './scenarios/Scenario05';
import Scenario06 from './scenarios/Scenario06';
import Scenario07 from './scenarios/Scenario07';
import Scenario08 from './scenarios/Scenario08';
import Scenario09 from './scenarios/Scenario09';
import Scenario10 from './scenarios/Scenario10';
import NarrationOverlay from './NarrationOverlay';

const SCENARIO_MAP = {
  1: Scenario01,
  2: Scenario02,
  3: Scenario03,
  4: Scenario04,
  5: Scenario05,
  6: Scenario06,
  7: Scenario07,
  8: Scenario08,
  9: Scenario09,
  10: Scenario10,
};

export default function ScenarioPlayer({ question, onComplete }) {
  const ScenarioComponent = SCENARIO_MAP[question.id];
  if (!ScenarioComponent) return null;
  return (
    <>
      <ScenarioComponent onComplete={onComplete} />
      <NarrationOverlay scriptId={question.id} />
    </>
  );
}