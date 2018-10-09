package com.gdssoft.oa.service.system;
import java.util.List;

import com.gdssoft.oa.model.system.Dictionary;
import com.gdssoft.core.service.BaseService;

public interface DictionaryService extends BaseService<Dictionary>{

	public List<String> getAllItems();

	public List<String> getAllByItemName(String itemName);
	
	public List<Dictionary> getByItemName(final String itemName);
}


