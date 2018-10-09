package com.gdssoft.oa.service.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.personal.PersonnelCardHistory;

public interface PersonnelCardHistoryService extends BaseService<PersonnelCardHistory>{
	public List<PersonnelCardHistory> getSignRecores(Date startTime,Date endTime);
	public List<PersonnelCardHistory> getSignOffRecores(Date startTime,
			Date endTime);
}


