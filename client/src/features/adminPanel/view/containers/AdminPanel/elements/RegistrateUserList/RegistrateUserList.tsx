import React from 'react';
import block from 'bem-cn';
import { Button } from 'consta-uikit-fork/Button';
import { Text } from 'consta-uikit-fork/Text';
import { TextField } from 'consta-uikit-fork/TextField';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { ProgressSpin } from 'consta-uikit-fork/ProgressSpin';

import './RegistrateUserList.scss';


interface IProps {
  registratedUsers: { email: string; orderNumber: number; }[];
  currentPrefix: string;
  currentFromNumber: number;
  currentToNumber: number;
  currentMailServer: string;
  currentDateForRegistration: string;
  numberOfUsersToRegistrate: number;
  currentDatasetId: number;
  onDatasetIdForUserRegistrateInputChangeHandler(args: { value: string | null }): void;
  onPrefixInputChangeHandler(args: { value: string | null }): void;
  onFromNumberInputChangeHandler(args: { value: string | null }): void;
  onToNumberInputChangeHandler(args: { value: string | null }): void;
  onMailServerInputChangeHandler(args: { value: string | null }): void;
  onRegistrationActiveUntilDateInputChangeHandler(args: { value: string | null }): void;
  onRegistrateAllButtonClickHandler(): void;
  onDownloadRegistratedUsersListButtonClickHandler(): void;
}

const b = block('registrate-user-list');

function RegistrateUserList(props: IProps): JSX.Element {
  const { registratedUsers, currentPrefix, currentFromNumber, currentToNumber, currentMailServer,
    currentDateForRegistration, numberOfUsersToRegistrate, currentDatasetId,
    onPrefixInputChangeHandler, onFromNumberInputChangeHandler, onToNumberInputChangeHandler,
    onMailServerInputChangeHandler, onRegistrationActiveUntilDateInputChangeHandler,
    onRegistrateAllButtonClickHandler, onDownloadRegistratedUsersListButtonClickHandler,
    onDatasetIdForUserRegistrateInputChangeHandler } = props;

  return (
    <div className={b()}>
      <div className={b('mass-registrate-form')}>
        <div className={b('distance-wrapper')}>
          Перфикс:
        </div>
        <TextField
          id="prefix"
          size="xs"
          value={currentPrefix}
          onChange={onPrefixInputChangeHandler}
          placeholder="team0"
        />
        <div className={b('distance-wrapper')}>
          с:
        </div>
        <TextField
          id="fromNumber"
          size="xs"
          value={currentFromNumber === -1 ? '' : String(currentFromNumber)}
          onChange={onFromNumberInputChangeHandler}
          placeholder="362"
        />
        <div className={b('distance-wrapper')}>
          по:
        </div>
        <TextField
          id="toNumber"
          size="xs"
          value={currentToNumber === -1 ? '' : String(currentToNumber)}
          onChange={onToNumberInputChangeHandler}
          placeholder="661"
        />
        <div className={b('distance-wrapper')}>
          сервер:
        </div>
        <TextField
          id="serverName"
          size="xs"
          value={currentMailServer}
          onChange={onMailServerInputChangeHandler}
          placeholder="hwtpu.ru"
        />
        <div className={b('distance-wrapper')}>
          активен до:
        </div>
        <TextField
          id="validDate"
          size="xs"
          type="date"
          value={currentDateForRegistration}
          onChange={onRegistrationActiveUntilDateInputChangeHandler}
        />
        <div className={b('distance-wrapper')}>
          № набора данных:
        </div>
        <TextField
          id="datasetId"
          size="xs"
          type="number"
          value={String(currentDatasetId)}
          onChange={onDatasetIdForUserRegistrateInputChangeHandler}
        />
        <div className={b('distance-wrapper')}>
          <Button
            iconLeft={IconCheck}
            size="xs"
            label="Зарегистрировать"
            onClick={onRegistrateAllButtonClickHandler}
          />
        </div>
        {numberOfUsersToRegistrate === registratedUsers.length && (
          <div className={b('distance-wrapper')}>
            <Button
              iconLeft={IconCheck}
              size="xs"
              label="Скачать список регистраций"
              onClick={onDownloadRegistratedUsersListButtonClickHandler}
            />
          </div>
        )}
      </div>
      {registratedUsers.length !== 0 && (
        <div className={b('registration-list')}>
          <div className={b('registration-list-row')}>
            <Text>{`Зарегистрировано: ${registratedUsers.length} из ${numberOfUsersToRegistrate}`}</Text>
            <div className={b('distance-wrapper')}>
              <ProgressSpin animation progress={Math.round((registratedUsers.length / numberOfUsersToRegistrate) * 100)} size="m" />
            </div>
          </div>
          <hr />
          {registratedUsers.map((item, index) => (
            <Text key={index}>{`${item.orderNumber}. ${item.email} ..... Зарегистрирован!`}</Text>
          ))}
        </div>
      )}
    </div>
  );
}

export { RegistrateUserList };
