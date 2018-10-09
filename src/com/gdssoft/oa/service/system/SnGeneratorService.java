package com.gdssoft.oa.service.system;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.SnGenerator;

public interface SnGeneratorService extends BaseService<SnGenerator> {
	
	/**
	 * 根据前缀产生完整的编号
	 * @param prefix 前缀
	 * @param suffix 后缀
	 * @param snLength 序号长度
	 * @return
	 */
	public String nextSNByPrefix(String prefix, String suffix, int snLength);
	
	
	/**
	 * 获取最新的SNNumber
	 */
	public SnGenerator nextSNNumber(String prefix);
}
