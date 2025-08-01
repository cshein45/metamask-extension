import { Mockttp } from 'mockttp';
import { USER_STORAGE_FEATURE_NAMES } from '@metamask/profile-sync-controller/user-storage';
import { withFixtures } from '../../helpers';
import FixtureBuilder from '../../fixture-builder';
import { completeOnboardFlowIdentity } from '../identity/flows';
import { UserStorageMockttpController } from '../../helpers/identity/user-storage/userStorageMockttpController';
import { IDENTITY_TEAM_STORAGE_KEY } from '../identity/constants';
import { createEncryptedResponse } from '../../helpers/identity/user-storage/generateEncryptedData';
import {
  enableNotificationsThroughGlobalMenu,
  enableNotificationsThroughSettingsPage,
} from '../../page-objects/flows/notifications.flow';
import NotificationsSettingsPage from '../../page-objects/pages/settings/notifications-settings-page';
import { Driver } from '../../webdriver/driver';
import { MockttpNotificationTriggerServer } from '../../helpers/notifications/mock-notification-trigger-server';
import { mockIdentityServices } from '../identity/mocks';
import { mockNotificationServices, notificationsMockAccounts } from './mocks';

/**
 * Generates encrypted mock response for notifications tests
 */
async function getNotificationsMockResponse() {
  return Promise.all(
    notificationsMockAccounts.map((account) =>
      createEncryptedResponse({
        data: account,
        storageKey: IDENTITY_TEAM_STORAGE_KEY,
        path: `${USER_STORAGE_FEATURE_NAMES.accounts}.${account.a}`,
      }),
    ),
  );
}

describe('Enable Notifications - With Accounts Syncing On', function () {
  this.timeout(120000); // Multiple Syncing features can cause this test to take some time

  describe('from inside MetaMask', function () {
    /**
     * Test notification settings persistence across sessions.
     *
     * Part 1: Initial Configuration
     * - Complete onboarding with pre-synced accounts
     * - Enable notifications and verify default state (all enabled)
     * - Modify settings:
     * → Disable second account notifications
     * → Disable product notifications
     *
     * Part 2: Persistence Check
     * - Start new session and complete onboarding
     * - Re-enable general notifications (required for each new session)
     * - Verify settings:
     * → General notifications: requires manual re-enable
     * → Product notifications: enabled (resets on new session)
     * → First account: enabled
     * → Second account: disabled (persisted from Part 1)
     */
    it('syncs notification settings on next onboarding after enabling for the first time', async function () {
      const userStorageMockttpController = new UserStorageMockttpController();
      const triggerServer = new MockttpNotificationTriggerServer();
      const mockedAccountsResponse = await getNotificationsMockResponse();

      // First device setup
      await withFixtures(
        {
          fixtures: new FixtureBuilder({ onboarding: true })
            .withMetaMetricsController()
            // Add mock accounts to subscriptionAccountsSeen so notification toggles appear
            .withNotificationServicesController({
              subscriptionAccountsSeen: notificationsMockAccounts.map(
                (account) => account.a,
              ),
            })
            .build(),
          title: this.test?.fullTitle(),
          testSpecificMock: async (server: Mockttp) => {
            userStorageMockttpController.setupPath(
              USER_STORAGE_FEATURE_NAMES.accounts,
              server,
              {
                getResponse: mockedAccountsResponse,
              },
            );
            return [
              await mockNotificationServices(server, triggerServer),
              await mockIdentityServices(server, userStorageMockttpController),
            ];
          },
        },
        async ({ driver }) => {
          await completeOnboardFlowIdentity(driver);
          await enableNotificationsThroughGlobalMenu(driver);
          const notificationsSettingsPage = new NotificationsSettingsPage(
            driver,
          );
          await notificationsSettingsPage.assertMainNotificationSettingsTogglesEnabled(
            driver,
          );
          await assertAllAccountsEnabled(driver);

          // Switch off address 2 and product notifications toggle
          await notificationsSettingsPage.clickNotificationToggle({
            address: notificationsMockAccounts[1].a,
            toggleType: 'address',
          });

          await notificationsSettingsPage.clickNotificationToggle({
            toggleType: 'product',
          });
        },
      );

      // Second device setup
      await withFixtures(
        {
          fixtures: new FixtureBuilder({ onboarding: true })
            // Add mock accounts to subscriptionAccountsSeen for second device too
            .withNotificationServicesController({
              subscriptionAccountsSeen: notificationsMockAccounts.map(
                (account) => account.a,
              ),
            })
            .build(),
          title: this.test?.fullTitle(),
          testSpecificMock: async (server: Mockttp) => {
            userStorageMockttpController.setupPath(
              USER_STORAGE_FEATURE_NAMES.accounts,
              server,
            );
            return [
              await mockNotificationServices(server, triggerServer),
              await mockIdentityServices(server, userStorageMockttpController),
            ];
          },
        },
        async ({ driver }) => {
          await completeOnboardFlowIdentity(driver);
          await enableNotificationsThroughSettingsPage(driver);
          const notificationsSettingsPage = new NotificationsSettingsPage(
            driver,
          );
          await notificationsSettingsPage.assertMainNotificationSettingsTogglesEnabled(
            driver,
          );

          // Assert Notification Account Settings have persisted
          // The second account was switched off from the initial run
          const [{ a: account1 }, { a: account2 }] = notificationsMockAccounts;
          await notificationsSettingsPage.check_notificationState({
            address: account1,
            toggleType: 'address',
            expectedState: 'enabled',
          });

          await notificationsSettingsPage.check_notificationState({
            address: account2,
            toggleType: 'address',
            expectedState: 'disabled',
          });
        },
      );
    });
    async function assertAllAccountsEnabled(driver: Driver) {
      const notificationsSettingsPage = new NotificationsSettingsPage(driver);
      for (const { a: address } of notificationsMockAccounts) {
        await notificationsSettingsPage.check_notificationState({
          address,
          toggleType: 'address',
          expectedState: 'enabled',
        });
      }
      return notificationsSettingsPage;
    }
  });
});
