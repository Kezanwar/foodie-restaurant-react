import { Controller, useFormContext } from 'react-hook-form';
import OpeningTimeInput from '../opening-time-input/OpeningTimeInput';

export function RHFOpeningTime({ name, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onCheck = async () => {
          await setValue(name, {
            ...field.value,
            is_open: !field.value.is_open
          });
        };
        const onOpenChange = async (e) => {
          const val = e.target.value;
          await setValue(name, {
            ...field.value,
            open: val
          });
        };
        const onCloseChange = async (e) => {
          const val = e.target.value;
          await setValue(name, {
            ...field.value,
            close: val
          });
        };
        return (
          <OpeningTimeInput
            onCheck={onCheck}
            onCloseChange={onCloseChange}
            onOpenChange={onOpenChange}
            name={name}
            field={field}
          />
        );
      }}
    />
  );
}
