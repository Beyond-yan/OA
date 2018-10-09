package com.gdssoft.oa.dao.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.communicate.OutMail;
import com.gdssoft.core.dao.BaseDao;
import java.util.*;

/**
 * 
 * @author 
 *
 */
public interface OutMailDao extends BaseDao<OutMail>{
	public List<OutMail> findByFolderId(Long folderId);
	public Long CountByFolderId(Long folderId);
	public Map getUidByUserId(Long userId);
}