import { Fragment, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import cx from 'classnames';
import CryptoJS from 'crypto-js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Tooltip } from 'react-tippy';
import Icon from '@mdi/react';
import {
  mdiAccount, mdiArrowLeft, mdiAutorenew, mdiMinus, mdiCheck,
  mdiEmoticonHappy, mdiEye, mdiHatFedora, mdiGlasses, mdiMustache,
  mdiTshirtCrew,
} from '@mdi/js';

import Avataaar, { Piece } from '../../../modules/avataaars';

import { userState } from '~/atoms/userState';
import { menuState } from '~/atoms/menuState';
import { modalState } from '~/atoms/modalState';
import { achievementState } from '~/atoms/achievementState';
import { achievementDictionary } from '~/atoms/achievementDictionary';

import options from './options';
import MenuPage from '../MenuPage/MenuPage';

import classes from './Avatar.module.scss';

function Avatar({ className }) {
  const [ firstTime, setFirstTime ] = useState(false);
  const [ selectedTab, setSelectedTab ] = useState(0);
  const [ avatarConfig, setAvatarConfig ] = useState({});
  const [ disableAccessories, setDisableAccessories ] = useState(false);
  const [ disableFacialHair, setDisableFacialHair ] = useState(false);
  const [ displayedVariations, setDisplayedVariations ] = useState([]);
  const setMenu = useSetRecoilState(menuState);
  const [ user, setUser ] = useRecoilState(userState);
  const dictionary = useRecoilValue(achievementDictionary);
  const awardAchievement = useSetRecoilState(achievementState);
  const openModal = useSetRecoilState(modalState);

  const tabs = {
    skinColor: { title: 'Skin', icon: mdiAccount },
    topType: { title: 'Head', icon: mdiHatFedora },
    eyeType: { title: 'Eyes', icon: mdiEye },
    eyebrowType: { title: 'Eyebrows', icon: mdiMinus },
    accessoriesType: { title: 'Glasses', icon: mdiGlasses },
    mouthType: { title: 'Mouth', icon: mdiEmoticonHappy },
    facialHairType: { title: 'Face', icon: mdiMustache },
    clotheType: { title: 'Clothes', icon: mdiTshirtCrew }
  };

  useEffect(() => {
    if (Object.keys(user.avatarConfig).length) {
      return setAvatarConfig(user.avatarConfig);
    }

    applyRandomAvatar();
    setFirstTime(true);
    openModal({
      contents: (
        <div className={classes.started}>
          <p>Before you jump into the fun, create an avatar to represent your virtual self.</p>
          <p className={classes.crazy}>(Or hit &quot;Randomize&quot; and create something crazy!)</p>
          <p>When you&apos;re done, hit &quot;Save and Start Playing&quot; to continue.</p>
          <p className={classes.fun}>Have fun!</p>
        </div>
      ),
      title: 'Getting Started'
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateRandomAvatar = () => {
    const { categories, variations } = options;

    const { generated } = Object.keys(categories).reduce((output, cat) => {
      const option = categories[cat][Math.floor(Math.random() * categories[cat].length)];

      if (option.variations?.length) {
        option.variations.forEach((varType) => {
          const availableVariations = variations[varType].filter((v) => {
            return !v.requires || user.achievements.find((a) => v.requires.includes(a.id));
          });
          output.generated[varType] = availableVariations[Math.floor(Math.random() * availableVariations.length)].type;
        });
      }

      output.generated[cat] = option.type;
      return output;
    }, { generated: {} });
    return generated;
  };

  const applyRandomAvatar = () => {
    const random = generateRandomAvatar();
    setDisableAccessories(options.categories.topType.find((top) => top.type === random.topType).disableAccessories);
    setDisableFacialHair(options.categories.topType.find((top) => top.type === random.topType).disableFacialHair);

    const selectedTabId = Object.keys(tabs)[selectedTab];
    const selectedItemVariations = options.categories[selectedTabId].find((t) => t.type === random[selectedTabId]).variations || [];
    setDisplayedVariations(selectedItemVariations);

    setAvatarConfig({
      skinColor: random.skinColor,
      topType: random.topType,
      hatColor: random.hatColor,
      hairColor: random.hairColor,
      eyeType: random.eyeType,
      eyebrowType: random.eyebrowType,
      accessoriesType: random.accessoriesType,
      mouthType: random.mouthType,
      facialHairType: random.facialHairType,
      facialHairColor: random.facialHairColor,
      clotheType: random.clotheType,
      clotheColor: random.clotheColor,
      graphicType: random.graphicType
    });
  };

  const generateTabs = () => {
    return Object.keys(tabs).map((tab, i) => {
      const isDisabled = (tab === 'accessoriesType' && disableAccessories) || (tab === 'facialHairType' && disableFacialHair);
      return (
        <Tab
          className={cx({
            [classes.active]: selectedTab === i,
            [classes.disabled]: isDisabled
          })}
          disabled={isDisabled}
          key={`${tab}-tab`}
        >
          <Icon path={tabs[tab].icon} rotate={tab === 'eyebrowType' ? 15 : 0} size={1.5} />{tabs[tab].title}
        </Tab>
      );
    });
  };

  const generatePanels = () => {
    return Object.keys(tabs).map((tab, i) => {
      return (
        <TabPanel
          className={cx(classes.panel, {
            [classes['panel-active']]: selectedTab === i
          })}
          key={`${tab}-panel`}
        >
          <div className={classes.options}>
            <div className={cx(classes.pieces, classes[tab])}>{generateOptions('categories', tab)}</div>
            {displayedVariations.length > 0 && (
              <div className={classes.variations}>
                {displayedVariations.map((varPiece) => (
                  <div className={classes[varPiece]} key={`vp-${varPiece}`}>
                    <h2>{varPiece === 'graphicType' ? 'Graphic' : 'Color'}</h2>
                    <div className={classes.pieces}>{generateOptions('variations', varPiece)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabPanel>
      );
    });
  };

  const generateOptions = (type, subtype) => {
    const opts = options[type][subtype].map((o) => {
      const isDisabled = o.requires && !user.achievements.find((a) => o.requires.includes(a.id));

      const option = (
        <div
          className={cx(classes.opt, {
            [classes.selected]: o.type === avatarConfig[subtype],
            [classes.disabled]: isDisabled
          })}
          key={`${subtype}-${o.type}`}
          onClick={() => {
            if (isDisabled) {
              return;
            }

            setDisableAccessories(o.disableAccessories);
            setDisableFacialHair(o.disableFacialHair);
            if (type !== 'variations') {
              setDisplayedVariations(o.variations || []);
            }
            setAvatarConfig({...avatarConfig, [subtype]: o.type });
          }}
        >
          {!['clotheColor', 'facialHairColor', 'hatColor', 'hairColor'].includes(subtype) ?
            <Piece
              accessoriesType={subtype === 'accessoriesType' && o.type}
              clotheColor={subtype === 'clotheType' && avatarConfig.clotheColor}
              clotheType={subtype === 'clotheType' && o.type}
              eyebrowType={subtype === 'eyebrowType' && o.type}
              eyeType={subtype === 'eyeType' && o.type}
              facialHairColor={subtype === 'facialHairType' && avatarConfig.facialHairColor}
              facialHairType={subtype === 'facialHairType' && o.type}
              graphicType={subtype === 'graphicType' && o.type}
              hairColor={subtype === 'topType' && avatarConfig.hairColor}
              hatColor={subtype === 'topType' && avatarConfig.hatColor}
              mouthType={subtype === 'mouthType' && o.type}
              pieceSize={subtype === 'graphicType' ? 90 : 90}
              pieceType={subtype === 'skinColor' ? 'skin' : subtype === 'graphicType' ? 'graphics' : subtype === 'eyeType' ? 'eyes' : subtype === 'eyebrowType' ? 'eyebrows' : subtype.slice(0, -4)}
              skinColor={subtype === 'skinColor' && o.type}
              topType={subtype === 'topType' && o.type}
            />
            :
            <span style={{ backgroundColor: o.color }} />
          }
        </div>
      );

      if (isDisabled) {
        const required = o.requires.map((r) => dictionary.find((d) => d.achievementId === r)?.name) || [];
        const unlockedBy = required.length ?
          <Fragment>Unlock by earning {required.length === 1 ? `the "${required[0]}" achievement` : <Fragment>one of these achievements:<br/>&quot;{required.sort().join('", "')}&quot;</Fragment>}</Fragment> :
          'Locked—Keep playing to unlock!';

        return (
          <Tooltip
            html={unlockedBy}
            key={`${subtype}-${o.type}`}
            position='top'
            unmountHTMLWhenHide
          >
            {option}
          </Tooltip>
        );
      }
      return option;
    });
    return opts;
  };

  const changeTab = (tab) => {
    const selectedTabId = Object.keys(tabs)[tab];
    const selectedItemVariations = options.categories[selectedTabId].find((t) => t.type === avatarConfig[selectedTabId]).variations || [];
    setDisplayedVariations(selectedItemVariations);
    setSelectedTab(tab);
  };

  const saveAvatar = async () => {
    try {
      const response = await fetch(`/api/v1/users/${user.emailAddress}`, {
        body: CryptoJS.AES.encrypt(JSON.stringify({
          avatarConfig,
          emailAddress: user.emailAddress
        }), user.key).toString(),
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        method: 'PUT'
      });

      if (!response.ok) {
        throw response;
      }
      setUser({ ...user, avatarConfig });
      awardAchievement('created_avatar');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MenuPage
      className={className}
      parentTitle='Profile'
      primaryAction={{
        action: saveAvatar,
        icon: mdiCheck,
        target: 'arcade',
        title: firstTime ? 'Save and Start Playing' : 'Save Avatar'
      }}
      secondaryAction={{
        action: () => setMenu({ active: 'login', backgroundEnabled: true }),
        icon: mdiArrowLeft,
        target: 'login',
        title: 'Return to Title Screen'
      }}
      title='Avatar'
    >
      <div className={classes.editor}>
        <div className={classes.preview}>
          <Avataaar avatarStyle='Circle' {...avatarConfig} />
          <button onClick={applyRandomAvatar}><Icon path={mdiAutorenew} size={1} /> Randomize</button>
        </div>
        <div className={classes.customize}>
          <Tabs
            className={classes.tabs}
            onSelect={changeTab}
            selectedIndex={selectedTab}
          >
            <TabList>{generateTabs()}</TabList>
            {generatePanels()}
          </Tabs>
        </div>
      </div>
    </MenuPage>
  );
};

export default Avatar;
