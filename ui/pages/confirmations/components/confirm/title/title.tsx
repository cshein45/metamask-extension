import {
  TransactionMeta,
  TransactionType,
} from '@metamask/transaction-controller';
import React, { memo, useMemo } from 'react';

import { TokenStandard } from '../../../../../../shared/constants/transaction';
import GeneralAlert from '../../../../../components/app/alert-system/general-alert/general-alert';
import { Box, Text } from '../../../../../components/component-library';
import {
  TextAlign,
  TextColor,
  TextVariant,
} from '../../../../../helpers/constants/design-system';
import useAlerts from '../../../../../hooks/useAlerts';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { TypedSignSignaturePrimaryTypes } from '../../../constants';
import { useConfirmContext } from '../../../context/confirm';
import { useTypedSignSignatureInfo } from '../../../hooks/useTypedSignSignatureInfo';
import { Confirmation, SignatureRequestType } from '../../../types/confirm';
import { isSIWESignatureRequest } from '../../../utils';
import { useIsNFT } from '../info/approve/hooks/use-is-nft';
import { useTokenTransactionData } from '../info/hooks/useTokenTransactionData';
import { getIsRevokeSetApprovalForAll } from '../info/utils';
import { getIsRevokeDAIPermit } from '../utils';
import { useSignatureEventFragment } from '../../../hooks/useSignatureEventFragment';
import { useTransactionEventFragment } from '../../../hooks/useTransactionEventFragment';
import { NestedTransactionTag } from '../../transactions/nested-transaction-tag';
import { useIsUpgradeTransaction } from '../info/hooks/useIsUpgradeTransaction';
import { useCurrentSpendingCap } from './hooks/useCurrentSpendingCap';

// TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
// eslint-disable-next-line @typescript-eslint/naming-convention
function ConfirmBannerAlert({ ownerId }: { ownerId: string }) {
  const { generalAlerts } = useAlerts(ownerId);
  const { updateSignatureEventFragment } = useSignatureEventFragment();
  const { updateTransactionEventFragment } = useTransactionEventFragment();

  if (generalAlerts.length === 0) {
    return null;
  }

  const onClickSupportLink = () => {
    const properties = {
      properties: {
        // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
        // eslint-disable-next-line @typescript-eslint/naming-convention
        external_link_clicked: 'security_alert_support_link',
      },
    };
    updateSignatureEventFragment(properties);
    updateTransactionEventFragment(properties, ownerId);
  };
  return (
    <Box marginTop={3}>
      {generalAlerts.map((alert) => (
        <Box marginTop={1} key={alert.key}>
          <GeneralAlert
            data-testid="confirm-banner-alert"
            title={alert.reason}
            description={alert.message}
            severity={alert.severity}
            provider={alert.provider}
            details={alert.alertDetails}
            reportUrl={alert.reportUrl}
            children={alert.content}
            onClickSupportLink={onClickSupportLink}
          />
        </Box>
      ))}
    </Box>
  );
}

type IntlFunction = (str: string) => string;

// todo: getTitle and getDescription can be merged to remove code duplication.

const getTitle = (
  t: IntlFunction,
  confirmation?: Confirmation,
  isNFT?: boolean,
  customSpendingCap?: string,
  isRevokeSetApprovalForAll?: boolean,
  pending?: boolean,
  primaryType?: keyof typeof TypedSignSignaturePrimaryTypes,
  tokenStandard?: string,
  isUpgradeOnly?: boolean,
) => {
  if (pending) {
    return '';
  }

  switch (confirmation?.type) {
    case TransactionType.contractInteraction:
      return t('confirmTitleTransaction');
    case TransactionType.batch:
      if (isUpgradeOnly) {
        return t('confirmTitleAccountTypeSwitch');
      }
      return t('confirmTitleTransaction');
    case TransactionType.deployContract:
      return t('confirmTitleDeployContract');
    case TransactionType.personalSign:
      if (isSIWESignatureRequest(confirmation as SignatureRequestType)) {
        return t('confirmTitleSIWESignature');
      }
      return t('confirmTitleSignature');
    case TransactionType.revokeDelegation:
      return t('confirmTitleAccountTypeSwitch');
    case TransactionType.signTypedData:
      if (primaryType === TypedSignSignaturePrimaryTypes.PERMIT) {
        const isRevokeDAIPermit = getIsRevokeDAIPermit(
          confirmation as SignatureRequestType,
        );
        if (isRevokeDAIPermit || customSpendingCap === '0') {
          return t('confirmTitleRevokeApproveTransaction');
        }

        if (tokenStandard === TokenStandard.ERC721) {
          return t('setApprovalForAllRedesignedTitle');
        }

        return t('confirmTitlePermitTokens');
      }
      return t('confirmTitleSignature');
    case TransactionType.tokenMethodApprove:
      if (isNFT) {
        return t('confirmTitleApproveTransactionNFT');
      }
      if (customSpendingCap === '0') {
        return t('confirmTitleRevokeApproveTransaction');
      }
      return t('confirmTitlePermitTokens');
    case TransactionType.tokenMethodIncreaseAllowance:
      return t('confirmTitlePermitTokens');
    case TransactionType.tokenMethodSetApprovalForAll:
      if (isRevokeSetApprovalForAll) {
        return t('confirmTitleSetApprovalForAllRevokeTransaction');
      }
      return t('setApprovalForAllRedesignedTitle');
    default:
      return '';
  }
};

const getDescription = (
  t: IntlFunction,
  confirmation?: Confirmation,
  isNFT?: boolean,
  customSpendingCap?: string,
  isRevokeSetApprovalForAll?: boolean,
  pending?: boolean,
  primaryType?: keyof typeof TypedSignSignaturePrimaryTypes,
  tokenStandard?: string,
  isUpgradeOnly?: boolean,
) => {
  if (pending) {
    return '';
  }

  switch (confirmation?.type) {
    case TransactionType.contractInteraction:
      return '';
    case TransactionType.batch:
      if (isUpgradeOnly) {
        return t('confirmTitleDescDelegationUpgrade');
      }
      return '';
    case TransactionType.deployContract:
      return t('confirmTitleDescDeployContract');
    case TransactionType.personalSign:
      if (isSIWESignatureRequest(confirmation as SignatureRequestType)) {
        return t('confirmTitleDescSIWESignature');
      }
      return t('confirmTitleDescSign');
    case TransactionType.revokeDelegation:
      return t('confirmTitleDescDelegationRevoke');
    case TransactionType.signTypedData:
      if (primaryType === TypedSignSignaturePrimaryTypes.PERMIT) {
        if (tokenStandard === TokenStandard.ERC721) {
          return t('confirmTitleDescApproveTransaction');
        }

        const isRevokeDAIPermit = getIsRevokeDAIPermit(
          confirmation as SignatureRequestType,
        );
        if (isRevokeDAIPermit || customSpendingCap === '0') {
          return '';
        }

        return t('confirmTitleDescPermitSignature');
      }
      return t('confirmTitleDescSign');
    case TransactionType.tokenMethodApprove:
      if (isNFT) {
        return t('confirmTitleDescApproveTransaction');
      }
      if (customSpendingCap === '0') {
        return '';
      }
      return t('confirmTitleDescERC20ApproveTransaction');
    case TransactionType.tokenMethodIncreaseAllowance:
      return t('confirmTitleDescPermitSignature');
    case TransactionType.tokenMethodSetApprovalForAll:
      if (isRevokeSetApprovalForAll) {
        return '';
      }
      return t('confirmTitleDescApproveTransaction');

    default:
      return '';
  }
};

const ConfirmTitle: React.FC = memo(() => {
  const t = useI18nContext();
  const { currentConfirmation } = useConfirmContext();
  const { isUpgradeOnly } = useIsUpgradeTransaction();

  const { isNFT } = useIsNFT(currentConfirmation as TransactionMeta);

  const { primaryType, tokenStandard } = useTypedSignSignatureInfo(
    currentConfirmation as SignatureRequestType,
  );

  const { customSpendingCap, pending: spendingCapPending } =
    useCurrentSpendingCap(currentConfirmation);

  const parsedTransactionData = useTokenTransactionData();

  const isRevokeSetApprovalForAll =
    currentConfirmation?.type ===
      TransactionType.tokenMethodSetApprovalForAll &&
    getIsRevokeSetApprovalForAll(parsedTransactionData);

  const title = useMemo(
    () =>
      getTitle(
        t as IntlFunction,
        currentConfirmation,
        isNFT,
        customSpendingCap,
        isRevokeSetApprovalForAll,
        spendingCapPending,
        primaryType,
        tokenStandard,
        isUpgradeOnly,
      ),
    [
      currentConfirmation,
      isNFT,
      customSpendingCap,
      isRevokeSetApprovalForAll,
      spendingCapPending,
      primaryType,
      t,
      tokenStandard,
      isUpgradeOnly,
    ],
  );

  const description = useMemo(
    () =>
      getDescription(
        t as IntlFunction,
        currentConfirmation,
        isNFT,
        customSpendingCap,
        isRevokeSetApprovalForAll,
        spendingCapPending,
        primaryType,
        tokenStandard,
        isUpgradeOnly,
      ),
    [
      currentConfirmation,
      isNFT,
      customSpendingCap,
      isRevokeSetApprovalForAll,
      spendingCapPending,
      primaryType,
      t,
      tokenStandard,
      isUpgradeOnly,
    ],
  );

  if (!currentConfirmation) {
    return null;
  }

  return (
    <>
      <ConfirmBannerAlert ownerId={currentConfirmation.id} />
      {title !== '' && (
        <Text
          variant={TextVariant.headingLg}
          paddingTop={4}
          paddingBottom={2}
          textAlign={TextAlign.Center}
        >
          {title}
        </Text>
      )}
      <NestedTransactionTag />
      {description !== '' && (
        <Text
          paddingBottom={4}
          color={TextColor.textAlternative}
          textAlign={TextAlign.Center}
        >
          {description}
        </Text>
      )}
    </>
  );
});

export default ConfirmTitle;
