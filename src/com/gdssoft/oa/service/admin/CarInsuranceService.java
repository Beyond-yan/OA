package com.gdssoft.oa.service.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.CarInsurance;

public interface CarInsuranceService extends BaseService<CarInsurance> {
	/**
	 * 
	 * 根据关联ID获取投保信息
	 * 
	 * @param carInsurance
	 * @return
	 */
	public List<CarInsurance> getCarInsurances(CarInsurance carInsurance);
}
