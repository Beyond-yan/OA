package com.gdssoft.oa.service.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.SysArchivesFiles;

public interface SysArchivesFilesService extends BaseService<SysArchivesFiles>{
	
	public List<SysArchivesFiles> findByDataId(Long id);
	
	public List<SysArchivesFiles> findByDataIdAndFileType(Long id,Long fileType);
	
	public int removeById(String id, Long dataId,Long fileType);
	
}

