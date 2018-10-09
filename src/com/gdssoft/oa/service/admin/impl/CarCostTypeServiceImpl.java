package com.gdssoft.oa.service.admin.impl;


import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarCostTypeDao;
import com.gdssoft.oa.model.admin.CarCostType;
import com.gdssoft.oa.service.admin.CarCostTypeService;

public class CarCostTypeServiceImpl extends BaseServiceImpl<CarCostType>
		implements CarCostTypeService {

	private CarCostTypeDao carCostTypeDao;
	public CarCostTypeServiceImpl(CarCostTypeDao carCostTypedao) {
		super(carCostTypedao);
		this.carCostTypeDao=carCostTypedao;
	}


}
