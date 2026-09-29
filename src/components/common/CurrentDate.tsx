import React from 'react';
import { useLiveDate, DateFormatType } from '../../utils/dateUtils';
import { useLanguage } from '../../context/LanguageContext';

interface CurrentDateProps {
  format?: DateFormatType;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CurrentDate: React.FC<CurrentDateProps> = ({
  format = 'full',
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const { language } = useLanguage();
  const { formattedDate } = useLiveDate(format, language);

  return (
    <span className={className}>
      {prefix}{formattedDate}{suffix}
    </span>
  );
};
