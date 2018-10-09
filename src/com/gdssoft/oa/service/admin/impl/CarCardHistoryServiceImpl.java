package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.admin.CarCardHistoryDao;
import com.gdssoft.oa.model.admin.CarCardHistory;
import com.gdssoft.oa.service.admin.CarCardHistoryService;

public class CarCardHistoryServiceImpl extends BaseServiceImpl<CarCardHistory> implements CarCardHistoryService{
	@SuppressWarnings("unused")
	private CarCardHistoryDao dao;
	
	public CarCardHistoryServiceImpl(CarCardHistoryDao dao) {
		super(dao);
		this.dao=dao;
	}
	@Override
	public  List findByCon(String cardType,String cardNum,String consumeType,String orderby,PagingBean pb)
	{
		return dao.findByCon(cardType, cardNum, consumeType,orderby,pb);
	}
	
}