import webpack from 'webpack';

import { getCommonRules, commonConfig, getStyleRules, BuildType, getCommonPlugins } from './common';

const getDevConfig: (type?: BuildType) => webpack.Configuration = type => {
  const rules: webpack.Rule[] = [
    ...getCommonRules(type || 'dev'),
    ...getStyleRules(type || 'dev'),
  ];

  return {
    ...commonConfig,
    mode: 'development',
    // devtool: 'source-map', // не хватает памяти
    entry: {
      app: './client.tsx',
    },
    module: {
      rules,
    },
    plugins: getCommonPlugins(type || 'dev'),
  };
};

/* eslint import/no-default-export: 0 */
export default getDevConfig;
