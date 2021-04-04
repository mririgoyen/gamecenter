import Icon from '@mdi/react';
import { mdiCircle, mdiGhost, mdiPacMan } from '@mdi/js';

import classes from './Controls.module.scss';

function Controls({ game }) {
  const renderObjective = () => {
    switch (game) {
      case 'pacman':
        return (
          <ul>
            <li><Icon color='#ffff00' horizontal path={mdiPacMan} size={1} /> avoids <Icon color='#ff0000' path={mdiGhost} size={1} /><Icon color='#ffafff' path={mdiGhost} size={1} /><Icon color='#01ffff' path={mdiGhost} size={1} /><Icon color='#ffaf47' path={mdiGhost} size={1} />.</li>
            <li className={classes['dot-adjust']}><Icon color='#ffafa4' path={mdiCircle} size={.3} /><Icon color='#ffafa4' path={mdiCircle} size={.3} /><Icon color='#ffafa4' path={mdiCircle} size={.3} /><Icon color='#ffafa4' path={mdiCircle} size={.3} /><Icon color='#ffafa4' path={mdiCircle} size={.3} /> Dots score 10 points.</li>
            <li>4 <Icon color='#ffafa4' path={mdiCircle} size={1} /> flashing energizers score 50 points.</li>
            <li>After energizing <Icon color='#ffff00' path={mdiPacMan} size={1} /> can attack <Icon color='#1e1eff' path={mdiGhost} size={1} /><Icon color='#1e1eff' path={mdiGhost} size={1} /><Icon color='#1e1eff' path={mdiGhost} size={1} /><Icon color='#1e1eff' path={mdiGhost} size={1} />.</li>
            <li>Beware of flashing monsters which are about to change back to the dangerous colors.</li>
          </ul>
        );

      case 'galaga':
        return (
          <ul>
            <li>Controls move ship right or left.</li>
            <li>To fire, press Fire button.</li>
            <li>Galaga captures Space Fighter with tractor-beam. Capture of last fighter ends game.</li>
            <li>When Galaga is destroyed, Space Fighter is freed.</li>
            <li>Freed Fighter docks for double fire power.</li>
          </ul>
        );

      case 'dkong':
        return (
          <ul>
            <li>Controls move Jumpman in 4 directions.</li>
            <li>Jump button makes Jumpman jump.</li>
            <li>If Jumpman reaches top, Donkey Kong takes the lady higher up, and structure changes shape.</li>
            <li>When a certain structures have been cleared, Jumpman saves the lady.</li>
            <li>Bonus points awarded based on time remaining.</li>
            <li>Extra Jumpman when you gain a certain points.</li>
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <h2>How to Play</h2>
      {renderObjective()}
      <h3>Controls</h3>
      <table>
        <tbody>
          {game !== 'galaga' && (
            <tr>
              <td>Up</td>
              <td>
                <kbd>↑</kbd>
                <kbd>W</kbd>
              </td>
              <td>Down</td>
              <td>
                <kbd>↓</kbd>
                <kbd>S</kbd>
              </td>
            </tr>
          )}
          <tr>
            <td>Left</td>
            <td>
              <kbd>←</kbd>
              <kbd>A</kbd>
            </td>
            <td>Right</td>
            <td>
              <kbd>→</kbd>
              <kbd>D</kbd>
            </td>
          </tr>
          {['galaga', 'dkong'].includes(game) && (
            <tr>
              <td>{game === 'galaga' ? 'Fire' : 'Jump'}</td>
              <td colSpan='3'>
                <kbd>Space</kbd>
                <kbd>{navigator.platform.includes('Mac') ? 'Return' : 'Enter'}</kbd>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Controls;