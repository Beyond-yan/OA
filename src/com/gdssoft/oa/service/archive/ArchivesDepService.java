package com.gdssoft.oa.service.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.core.service.BaseService;

public interface ArchivesDepService extends BaseService<ArchivesDep>{
	/**
	 * 获得已分发文件的部门
	 * @param archivesId
	 * @return
	 */
	public List<ArchivesDep> getSentArchsByArchId(Long archivesId);
	
	/**
	 * 更新公文下载状态
	 * @param archivesId
	 * @return
	 */
	public void  updateDownload(String archivesId,String userId);
	
}


