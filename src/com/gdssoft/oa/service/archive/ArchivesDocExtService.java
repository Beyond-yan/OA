package com.gdssoft.oa.service.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.archive.ArchivesDocExt;

public interface ArchivesDocExtService extends BaseService<ArchivesDocExt>{
	/**
	 * 根据公文ID来查找公文撰稿
	 */
	public List<ArchivesDocExt> findByAid(Long archivesId);
}


