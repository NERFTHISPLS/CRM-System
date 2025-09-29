import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUserProfile } from '@/store/selectors';
import { fetchUserById, updateUser } from '@/store/slices/adminSlice';
import type { AsyncRequestData } from '@/store/utils';
import type { User } from '@/types/user';
import {
  EMAIL_INPUT_RULES,
  PHONE_NUMBER_INPUT_RULES,
  USERNAME_INPUT_RULES,
} from '@/utils/constants';
import { getErrorMessage } from '@/utils/helpers';
import {
  Alert,
  Button,
  Flex,
  Form,
  Input,
  message,
  Space,
  Spin,
  type FormProps,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

function getChangedFields<T extends object>(
  original: T,
  updated: T
): Partial<T> {
  const changedFields: Partial<T> = {};

  Object.keys(original).forEach((key) => {
    const fieldKey = key as keyof T;

    if (original[fieldKey] !== updated[fieldKey]) {
      changedFields[fieldKey] = original[fieldKey];
    }
  });

  return changedFields;
}

interface FormField {
  username: string;
  email: string;
  phoneNumber: string;
}

function SelectedProfilePage() {
  const {
    data: selectedProfile,
    status: { isLoading: isInitialLoading },
    error,
  }: AsyncRequestData<User> = useAppSelector(selectUserProfile);
  const [updatedProfile, setUpdatedProfile] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id?: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isUpdatingUser, setIsUpdatingUser] = useState<boolean>(false);
  const [isEditSession, setIsEditSession] = useState<boolean>(false);
  const [form] = Form.useForm<FormField>();

  const profile = updatedProfile || selectedProfile;

  useEffect(() => {
    async function loadProfileInfo(): Promise<void> {
      await dispatch(fetchUserById(Number(id)));
    }

    loadProfileInfo();
  }, [dispatch, id]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        username: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
      });
    }
  }, [profile, form]);

  function handleUpdateProfileCancel(): void {
    if (profile) {
      form.setFieldsValue({
        username: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
      });
    }
    setIsEditSession(false);
  }

  const handleUpdateProfile: FormProps<FormField>['onFinish'] = async (
    formFields
  ) => {
    if (!profile) {
      setIsEditSession(false);
      return;
    }

    const trimmedFormData = Object.fromEntries(
      Object.entries(formFields).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    ) as FormField;

    const changedFields = getChangedFields(trimmedFormData, profile);

    if (!Object.keys(changedFields).length) {
      setIsEditSession(false);
      return;
    }

    setIsUpdatingUser(true);
    try {
      const newProfile = await dispatch(
        updateUser({ id: profile.id, fields: changedFields })
      ).unwrap();

      setUpdatedProfile(newProfile);
      messageApi.success('User data was updated successfully');
      setIsEditSession(false);
    } catch (err) {
      messageApi.error(getErrorMessage(err));
    } finally {
      setIsUpdatingUser(false);
    }
  };

  if (isInitialLoading) {
    return (
      <Flex justify="center" style={{ width: '100%', marginTop: 50 }}>
        <Spin spinning={isInitialLoading} />
      </Flex>
    );
  }

  if (!isEditSession && error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ width: '100%' }}
      />
    );
  }

  return (
    <>
      {contextHolder}
      <Spin spinning={isUpdatingUser}>
        <Flex gap="middle" vertical style={{ padding: '1rem' }}>
          <h2>
            Profile info of user {profile?.username} with id {profile?.id}
          </h2>

          <Form
            labelCol={{ span: 3 }}
            form={form}
            onFinish={handleUpdateProfile}
          >
            <FormItem<FormField>
              name="username"
              label="Username"
              rules={USERNAME_INPUT_RULES}
              required={false} // to not show the * symbol
            >
              <Input disabled={!isEditSession} />
            </FormItem>

            <FormItem<FormField>
              name="email"
              label="Email"
              rules={EMAIL_INPUT_RULES}
              required={false} // to not show the * symbol
            >
              <Input disabled={!isEditSession} />
            </FormItem>

            <FormItem<FormField>
              name="phoneNumber"
              label="Phone number"
              rules={PHONE_NUMBER_INPUT_RULES}
            >
              <Input disabled={!isEditSession} />
            </FormItem>

            <FormItem<FormField>>
              {isEditSession ? (
                <Space>
                  <Button
                    htmlType="submit"
                    color="primary"
                    variant="outlined"
                    style={{ alignSelf: 'start' }}
                  >
                    Save
                  </Button>

                  <Button
                    htmlType="button"
                    variant="outlined"
                    style={{ alignSelf: 'start' }}
                    onClick={handleUpdateProfileCancel}
                  >
                    Cancel
                  </Button>
                </Space>
              ) : (
                <Button
                  htmlType="button"
                  color="primary"
                  variant="outlined"
                  style={{ alignSelf: 'start' }}
                  onClick={() => setIsEditSession(true)}
                >
                  Edit
                </Button>
              )}
            </FormItem>
          </Form>

          <Link to="/users">Back to users</Link>
        </Flex>
      </Spin>
    </>
  );
}

export default SelectedProfilePage;
