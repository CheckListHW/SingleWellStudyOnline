import React from 'react';
import block from 'bem-cn';
import { Button } from 'consta-uikit-fork/Button';
import { TextField } from 'consta-uikit-fork/TextField';
import { FileField } from 'consta-uikit-fork/FileField';
import { IconUpload } from 'consta-uikit-fork/IconUpload';

import './UploadDatasetForm.scss';

interface IProps {
  fileName: string;
  datasetId: number;
  description: string;
  onFileInputChangeHandler(event: any): void;
  onDatasetIdInputChangeHandler(args: { value: string | null }): void;
  onDatasetDiscriptionInputChangeHandler(args: { value: string | null }): void;
  onDownloadDataSetButtonClickHandler(): void;
}


const b = block('upload-dataset-form');

const UploadDatasetForm = (componentProps: IProps): JSX.Element => {
  const { fileName, datasetId, description, onDownloadDataSetButtonClickHandler,
    onDatasetIdInputChangeHandler, onDatasetDiscriptionInputChangeHandler,
    onFileInputChangeHandler } = componentProps;
  return (
    <div className={b()}>
      <div className={b('distance-wrapper')}>
        <TextField
          value={fileName}
          placeholder="Файл набора данных"
          size="xs"
        />
      </div>
      <div className={b('distance-wrapper')}>
        <FileField id="fileFieldForDataSet" onChange={onFileInputChangeHandler}>
          {props => (
            <Button
              {...props}
              label="Выбрать файл"
              size="xs"
            />
          )}
        </FileField>
      </div>
      <div className={b('distance-wrapper')}>
        <TextField
          value={datasetId === 0 ? '' : String(datasetId)}
          placeholder="Номер набора данных"
          size="xs"
          onChange={onDatasetIdInputChangeHandler}
        />
      </div>
      <div className={b('distance-wrapper')}>
        <TextField
          value={description}
          placeholder="Описание набора данных"
          size="xs"
          onChange={onDatasetDiscriptionInputChangeHandler}
        />
      </div>
      <Button
        label="Загрузить набор на сервер"
        iconLeft={IconUpload}
        size="xs"
        onClick={onDownloadDataSetButtonClickHandler}
      />
    </div>
  );
};

export { UploadDatasetForm };
