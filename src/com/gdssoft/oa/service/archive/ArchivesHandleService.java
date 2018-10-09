package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchivesHandle;
import com.gdssoft.core.service.BaseService;

public interface ArchivesHandleService extends BaseService<ArchivesHandle>{
	public ArchivesHandle findByUAIds(Long userId, Long archiveId);
	/**
	 * 根据所属公文ID来查找记录
	 */
	public List<ArchivesHandle> findByAid(Long archiveId);
	/**
	 * 根据公文来统计意见的条数
	 * @param archiveId
	 * @return
	 */
	public int countHandler(Long archiveId);
}


