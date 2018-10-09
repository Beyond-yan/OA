package com.gdssoft.oa.dao.system;

import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.DocDirectory;

public interface DocDirectoryDao extends BaseDao<DocDirectory>{
	public List<DocDirectory> findByDeptId(Long deptId);
	public List<DocDirectory> findByParentId(Long parentId);
	
	/**
	 * 查询归档文件的大小
	 * 
	 * @param docDirectory
	 * @return
	 */
	public Double getTotalBytes(DocDirectory docDirectory);
}
