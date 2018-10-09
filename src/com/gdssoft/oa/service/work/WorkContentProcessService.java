package com.gdssoft.oa.service.work;

import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.work.WorkContentProcess;

public interface WorkContentProcessService extends BaseService<WorkContentProcess>{
    public List<WorkContentProcess> getProcessListById(Long workContentId);
}
