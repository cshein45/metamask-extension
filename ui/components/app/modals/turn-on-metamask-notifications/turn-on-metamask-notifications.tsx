import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { I18nContext } from '../../../../contexts/i18n';
import { useModalProps } from '../../../../hooks/useModalProps';
import { useMetamaskNotificationsContext } from '../../../../contexts/metamask-notifications/metamask-notifications';
import { MetaMetricsContext } from '../../../../contexts/metametrics';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../../shared/constants/metametrics';
import {
  selectIsMetamaskNotificationsEnabled,
  getIsUpdatingMetamaskNotifications,
} from '../../../../selectors/metamask-notifications/metamask-notifications';
import { selectIsBackupAndSyncEnabled } from '../../../../selectors/identity/backup-and-sync';
import { useEnableNotifications } from '../../../../hooks/metamask-notifications/useNotifications';
import { NOTIFICATIONS_ROUTE } from '../../../../helpers/constants/routes';

import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalFooter,
} from '../../../component-library';
import {
  AlignItems,
  BlockSize,
  BorderRadius,
  FlexDirection,
  FontWeight,
  TextColor,
} from '../../../../helpers/constants/design-system';

// TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
// eslint-disable-next-line @typescript-eslint/naming-convention
export default function TurnOnMetamaskNotifications() {
  const { hideModal } = useModalProps();
  const history = useHistory();
  const t = useContext(I18nContext);
  const trackEvent = useContext(MetaMetricsContext);
  const { listNotifications } = useMetamaskNotificationsContext();

  const isNotificationEnabled = useSelector(
    selectIsMetamaskNotificationsEnabled,
  );
  const isUpdatingMetamaskNotifications = useSelector(
    getIsUpdatingMetamaskNotifications,
  );
  const isBackupAndSyncEnabled = useSelector(selectIsBackupAndSyncEnabled);

  const [isLoading, setIsLoading] = useState<boolean>(
    isUpdatingMetamaskNotifications,
  );

  const { enableNotifications, error } = useEnableNotifications();

  const handleTurnOnNotifications = async () => {
    setIsLoading(true);
    trackEvent({
      category: MetaMetricsEventCategory.NotificationsActivationFlow,
      event: MetaMetricsEventName.NotificationsActivated,
      properties: {
        // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
        // eslint-disable-next-line @typescript-eslint/naming-convention
        is_profile_syncing_enabled: true,
        // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
        // eslint-disable-next-line @typescript-eslint/naming-convention
        action_type: 'activated',
      },
    });
    await enableNotifications();
  };

  const handleHideModal = () => {
    hideModal();
    setIsLoading((prevLoadingState) => {
      if (!prevLoadingState) {
        trackEvent({
          category: MetaMetricsEventCategory.NotificationsActivationFlow,
          event: MetaMetricsEventName.NotificationsActivated,
          properties: {
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
            // eslint-disable-next-line @typescript-eslint/naming-convention
            is_profile_syncing_enabled: isBackupAndSyncEnabled,
            // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31860
            // eslint-disable-next-line @typescript-eslint/naming-convention
            action_type: 'dismissed',
          },
        });
      }
      return prevLoadingState;
    });
  };

  useEffect(() => {
    if (isNotificationEnabled && !error) {
      history.push(NOTIFICATIONS_ROUTE);
      hideModal();
      listNotifications();
    }
  }, [isNotificationEnabled, error, history, hideModal, listNotifications]);

  const privacyLink = (
    <Text
      as="a"
      href="https://support.metamask.io/privacy-and-security/profile-privacy"
      target="_blank"
      rel="noopener noreferrer"
      key="privacy-link"
      color={TextColor.infoDefault}
    >
      {t('turnOnMetamaskNotificationsMessagePrivacyLink')}
    </Text>
  );

  const strongText = (
    <Text as="span" fontWeight={FontWeight.Bold} key="strong-text">
      {t('turnOnMetamaskNotificationsMessagePrivacyBold')}
    </Text>
  );

  return (
    <Modal isOpen onClose={() => handleHideModal()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader onClose={() => handleHideModal()}>
          {t('turnOnMetamaskNotifications')}
        </ModalHeader>
        <ModalBody>
          <Box
            as="img"
            src="./images/turn-on-metamask-notifications.png"
            width={BlockSize.Full}
            borderRadius={BorderRadius.MD}
            marginBottom={4}
          />
          <Text as="p">{t('turnOnMetamaskNotificationsMessageFirst')}</Text>
          <Text as="p" paddingTop={4}>
            {
              // @ts-expect-error: Expected 0-1 arguments, but got an array.
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              t('turnOnMetamaskNotificationsMessageSecond', [privacyLink])
            }
          </Text>
          <Text as="p" paddingTop={4}>
            {
              // @ts-expect-error: Expected 0-1 arguments, but got an array.
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              t('turnOnMetamaskNotificationsMessageThird', [strongText])
            }
          </Text>
        </ModalBody>
        <ModalFooter
          paddingTop={4}
          // TODO: Fix in https://github.com/MetaMask/metamask-extension/issues/31879
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={() => handleTurnOnNotifications()}
          containerProps={{
            flexDirection: FlexDirection.Column,
            alignItems: AlignItems.stretch,
          }}
          submitButtonProps={{
            children: t('turnOnMetamaskNotificationsButton'),
            loading: isLoading,
            disabled: isLoading,
            'data-testid': 'turn-on-notifications-button',
          }}
        />
        {error && (
          <Box paddingLeft={4} paddingRight={4}>
            <Text as="p" color={TextColor.errorDefault} paddingTop={4}>
              {t('turnOnMetamaskNotificationsError')}
            </Text>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
}
