package com.gdssoft.oa.service.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchDispatch;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface ArchDispatchService extends BaseService<ArchDispatch>{
	public List<ArchDispatch> findByUser(AppUser user,PagingBean pb);
	/**
	 * 根据公文的ID来查找阅读处理的记录数
	 */
	public int countArchDispatch(Long archivesId);
}


