package com.gdssoft.oa.service.admin.impl;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarCostRecordDetailDao;
import com.gdssoft.oa.model.admin.CarCostRecordDetail;
import com.gdssoft.oa.service.admin.CarCostRecordDetailService;

public class CarCostRecordDetailServiceImpl extends BaseServiceImpl<CarCostRecordDetail> implements CarCostRecordDetailService {

	private CarCostRecordDetailDao carCostRecordDetaildao;
	public CarCostRecordDetailServiceImpl(CarCostRecordDetailDao carCostRecordDetaildao) {
		super(carCostRecordDetaildao);
		this.carCostRecordDetaildao=carCostRecordDetaildao;
	}

	public void deleteByRecordId(Long recordId){
		 carCostRecordDetaildao.deleteByRecordId(recordId);
		
	}
}
