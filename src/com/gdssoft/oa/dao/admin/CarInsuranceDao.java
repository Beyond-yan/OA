package com.gdssoft.oa.dao.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.admin.CarInsurance;

/**
 * 
 * @author
 * 
 */
public interface CarInsuranceDao extends BaseDao<CarInsurance> {
	/**
	 * 
	 * 根据关联ID获取投保信息
	 * 
	 * @param carInsurance
	 * @return
	 */
	public List<CarInsurance> getCarInsurances(CarInsurance carInsurance);
}