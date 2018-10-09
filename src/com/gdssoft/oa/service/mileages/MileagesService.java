package com.gdssoft.oa.service.mileages;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.mileages.Mileages;

public interface MileagesService extends BaseService<Mileages>{
	public Long count(Date startDate, Date endDate,String cn);
	public List<Mileages> selectByCostType(Date startDate, Date endDate,String cn,int size ,int start);
}


