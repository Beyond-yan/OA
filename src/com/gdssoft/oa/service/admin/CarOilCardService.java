package com.gdssoft.oa.service.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.CarOilCard;

public interface CarOilCardService extends BaseService<CarOilCard>{
	
	void unBindWithCar(String cardID);
	
}


