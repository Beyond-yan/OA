package com.gdssoft.oa.service.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.model.jw.JwRecArchives;

public interface JwRecArchivesService extends BaseService<JwRecArchives>{

	List<JwRecArchives> getJwArchives(Long userId, String subject, String depName,
			String startDate, String endDate, int currentPage, int pageSize,
			String archiveNo, String depSignNo);

	int count(Long userId, String subject, String depName, String startDate,
			String endDate, String archiveNo, String depSignNo);
	
}


