import { Button, Col, Flex, Modal, Row } from 'antd';
import { ChangeEvent, useEffect, useState } from 'react';
import toastMessage from '../../lib/toastMessage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getCreateVariantModel,
  getCreateVariantModelData,
  toggleCreateVariantModel,
} from '../../redux/services/modal.Slice';
import { IProduct } from '../../types/prduct.types';
import ModalInput from './ModalInput';
import { useCreateNewProductMutation } from '../../redux/features/productApi';

const CreateVariantModal = () => {
  const modalOpen = useAppSelector(getCreateVariantModel);
  const data = useAppSelector(getCreateVariantModelData);
  const [createVariant] = useCreateNewProductMutation();
  const dispatch = useAppDispatch();
  const [updateDate, setUpdateDate] = useState<Partial<IProduct>>();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdateDate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async () => {
    const payload: any = { ...updateDate };
    payload.price = Number(updateDate?.price);
    payload.quantity = Number(updateDate?.quantity);
    delete payload?._id;
    delete payload.createdAt;
    delete payload?.updatedAt;
    delete payload?.__v;
    delete payload?.user;

    console.log(payload);

    try {
      const res = await createVariant(payload).unwrap();
      console.log(res);

      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        dispatch(toggleCreateVariantModel({ open: false, data: null }));
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', title: error.data.message, text: error.data.errors[0] });
    }
  };

  useEffect(() => {
    setUpdateDate(data!);
  }, [data]);

  return (
    <>
      <Modal
        title='Create an new variant of Product'
        centered
        open={modalOpen}
        onOk={() => dispatch(toggleCreateVariantModel({ open: false, data: null }))}
        onCancel={() => dispatch(toggleCreateVariantModel({ open: false, data: null }))}
        footer={[
          <Button
            key='back'
            onClick={() => dispatch(toggleCreateVariantModel({ open: false, data: null }))}
          >
            Close
          </Button>,
        ]}
      >
        <form>
          <ModalInput
            handleChange={handleChange}
            name='name'
            defaultValue={updateDate?.name}
            label='Name'
          />
          <ModalInput
            handleChange={handleChange}
            defaultValue={updateDate?.color}
            label='Color'
            name='color'
          />
          <ModalInput
            handleChange={handleChange}
            defaultValue={updateDate?.type}
            label='Type'
            name='type'
          />
          <ModalInput
            handleChange={handleChange}
            label='Price'
            type='number'
            defaultValue={updateDate?.price}
            name='price'
          />
          <ModalInput
            handleChange={handleChange}
            label='Quantity'
            type='number'
            name='quantity'
            defaultValue={updateDate?.quantity}
          />
          <ModalInput
            handleChange={handleChange}
            label='Fragrance'
            defaultValue={updateDate?.fragrance}
            name='fragrance'
          />
          <ModalInput
            handleChange={handleChange}
            label='BloomDate'
            type='date'
            name='bloomDate'
            defaultValue={updateDate?.bloomDate}
          />
          <Row>
            <Col span={6}>
              <label htmlFor='Size' className='label'>
                Size
              </label>
            </Col>
            <Col span={18}>
              <select
                defaultValue={updateDate?.size}
                value={updateDate?.size}
                onChange={handleChange}
                className={`input-field`}
              >
                <option value=''>Select Product Size*</option>
                <option value='SMALL'>Small</option>
                <option value='MEDIUM'>Medium</option>
                <option value='LARGE'>Large</option>
              </select>
            </Col>
          </Row>
          <Flex justify='center' style={{ margin: '1rem' }}>
            <Button key='submit' type='primary' onClick={onSubmit}>
              Create New Variant
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default CreateVariantModal;
