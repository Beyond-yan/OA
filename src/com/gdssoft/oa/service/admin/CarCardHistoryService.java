package com.gdssoft.oa.service.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.admin.CarCardHistory;

public interface CarCardHistoryService extends BaseService<CarCardHistory>{
	List findByCon(String cardType,String cardNum,String consumeType,String orderby,PagingBean pb);
}


