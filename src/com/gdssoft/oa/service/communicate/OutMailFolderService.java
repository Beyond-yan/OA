package com.gdssoft.oa.service.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.communicate.MailFolder;
import com.gdssoft.oa.model.communicate.OutMailFolder;
import com.gdssoft.core.service.BaseService;

public interface OutMailFolderService extends BaseService<OutMailFolder>{
	public List<OutMailFolder> getAllUserFolderByParentId(Long userId, Long parentId);
	public List<OutMailFolder> getUserFolderByParentId(Long userId,Long parentId);
	public List<OutMailFolder> getFolderLikePath(String path);
}


