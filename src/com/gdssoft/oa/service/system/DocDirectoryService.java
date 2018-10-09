package com.gdssoft.oa.service.system;

import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.DocDirectory;

public interface DocDirectoryService extends BaseService<DocDirectory>{
	public List<DocDirectory> findAllLevel4();
	public List<DocDirectory> findByParentId(Long parentId);
	public List<DocDirectory> findByDeptId(Long deptId);
	
	/**
	 * 查询归档文件的大小
	 * 
	 * @param docDirectory
	 * @return
	 */
	public Double getTotalBytes(DocDirectory docDirectory);
}
